-- ============================================
-- DATABASE SCHEMA FOR ALGOFORGE (PERN Stack)
-- Complete Updated Version with all features
-- Run this file ONCE on your PostgreSQL server
-- ============================================

-- ============================================
-- CREATE TABLES
-- ============================================

-- Users table (authentication & profile)
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    username VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    is_banned BOOLEAN DEFAULT FALSE,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_code VARCHAR(10),
    verification_expires TIMESTAMP,
    reset_token VARCHAR(255) NULL,
    reset_expires TIMESTAMP NULL,
    avatar_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Categories (top level: Algorithm, Data Structure, Complexity)
CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,      -- e.g., 'algorithm'
    display_name VARCHAR(100) NOT NULL,     -- e.g., 'Algorithm'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Types (e.g., Sorting, Searching under Algorithm)
CREATE TABLE IF NOT EXISTS types (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(category_id, name)
);

-- Subtypes (e.g., Bubble Sort under Sorting)
CREATE TABLE IF NOT EXISTS subtypes (
    id SERIAL PRIMARY KEY,
    type_id INTEGER NOT NULL REFERENCES types(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(type_id, name)
);

-- Files (learning topics)
CREATE TABLE IF NOT EXISTS files (
    id SERIAL PRIMARY KEY,
    subtype_id INTEGER NOT NULL REFERENCES subtypes(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,            -- e.g., 'bubble_sort.py'
    notes TEXT,                            -- rich text / markdown
    demo_code TEXT,                        -- HTML/CSS/JS string
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(subtype_id, name)
);

-- Example codes (multiple per file, per language)
CREATE TABLE IF NOT EXISTS example_codes (
    id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    language VARCHAR(20) NOT NULL CHECK (language IN ('python', 'javascript', 'cpp', 'java')),
    code TEXT NOT NULL,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quizzes (a set of questions for a file)
CREATE TABLE IF NOT EXISTS quizzes (
    id SERIAL PRIMARY KEY,
    file_id INTEGER NOT NULL REFERENCES files(id) ON DELETE CASCADE,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Quiz questions (each question with 4 options)
CREATE TABLE IF NOT EXISTS quiz_questions (
    id SERIAL PRIMARY KEY,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User quiz attempts (track progress & scores)
CREATE TABLE IF NOT EXISTS user_quiz_attempts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    quiz_id INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
    score INTEGER NOT NULL,                 -- percentage (0-100)
    answers JSONB,                          -- store user's answers as JSON
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, quiz_id)                -- one attempt per quiz per user
);

-- Chat messages (with reply functionality)
CREATE TABLE IF NOT EXISTS chat_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')),
    content TEXT NOT NULL,                  -- for text: message; for attachments: original filename
    file_url TEXT,                          -- path or URL to uploaded file
    file_size INTEGER,
    mime_type VARCHAR(100),
    parent_id INTEGER REFERENCES chat_messages(id) ON DELETE CASCADE,
    reply_to_username VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted_by_admin BOOLEAN DEFAULT FALSE
);

-- Notifications (in-app)
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,              -- 'new_content', 'mention', etc.
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    related_file_id INTEGER,                -- optional link to file
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for performance
-- ============================================

-- Auth & user lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_reset_token ON users(reset_token);
CREATE INDEX IF NOT EXISTS idx_users_verification_code ON users(verification_code);

-- Foreign key indexes
CREATE INDEX IF NOT EXISTS idx_types_category_id ON types(category_id);
CREATE INDEX IF NOT EXISTS idx_subtypes_type_id ON subtypes(type_id);
CREATE INDEX IF NOT EXISTS idx_files_subtype_id ON files(subtype_id);
CREATE INDEX IF NOT EXISTS idx_example_codes_file_id ON example_codes(file_id);
CREATE INDEX IF NOT EXISTS idx_example_codes_language ON example_codes(language);
CREATE INDEX IF NOT EXISTS idx_quizzes_file_id ON quizzes(file_id);
CREATE INDEX IF NOT EXISTS idx_quiz_questions_quiz_id ON quiz_questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_user_id ON user_quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_user_quiz_attempts_quiz_id ON user_quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_user_id ON chat_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_parent_id ON chat_messages(parent_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Full-text search for files (name + notes) and example_codes (code)
ALTER TABLE files ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', COALESCE(name, '') || ' ' || COALESCE(notes, ''))) STORED;
CREATE INDEX IF NOT EXISTS idx_files_search ON files USING GIN(search_vector);

ALTER TABLE example_codes ADD COLUMN IF NOT EXISTS search_vector tsvector
  GENERATED ALWAYS AS (to_tsvector('english', COALESCE(code, ''))) STORED;
CREATE INDEX IF NOT EXISTS idx_example_codes_search ON example_codes USING GIN(search_vector);

-- ============================================
-- TRIGGERS
-- ============================================

-- Update 'updated_at' on files
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_files_updated_at ON files;
CREATE TRIGGER update_files_updated_at BEFORE UPDATE ON files
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Update 'updated_at' on users
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- INSERT DEFAULT DATA
-- ============================================

-- Insert default categories
INSERT INTO categories (name, display_name) VALUES
('algorithm', 'Algorithm'),
('dataStructure', 'Data Structure'),
('complexity', 'Complexity')
ON CONFLICT (name) DO NOTHING;

-- Insert types for Algorithm
INSERT INTO types (category_id, name, order_index) 
SELECT id, 'Sorting', 1 FROM categories WHERE name = 'algorithm'
UNION ALL
SELECT id, 'Searching', 2 FROM categories WHERE name = 'algorithm'
UNION ALL
SELECT id, 'Graph', 3 FROM categories WHERE name = 'algorithm'
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert types for Data Structure
INSERT INTO types (category_id, name, order_index) 
SELECT id, 'Linear', 1 FROM categories WHERE name = 'dataStructure'
UNION ALL
SELECT id, 'Non-Linear', 2 FROM categories WHERE name = 'dataStructure'
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert types for Complexity
INSERT INTO types (category_id, name, order_index) 
SELECT id, 'Time Complexity', 1 FROM categories WHERE name = 'complexity'
UNION ALL
SELECT id, 'Space Complexity', 2 FROM categories WHERE name = 'complexity'
ON CONFLICT (category_id, name) DO NOTHING;

-- Insert subtypes for Sorting
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'Bubble Sort' FROM types t WHERE t.name = 'Sorting'
UNION ALL
SELECT t.id, 'Quick Sort' FROM types t WHERE t.name = 'Sorting'
UNION ALL
SELECT t.id, 'Merge Sort' FROM types t WHERE t.name = 'Sorting'
ON CONFLICT (type_id, name) DO NOTHING;

-- Insert subtypes for Searching
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'Linear Search' FROM types t WHERE t.name = 'Searching'
UNION ALL
SELECT t.id, 'Binary Search' FROM types t WHERE t.name = 'Searching'
ON CONFLICT (type_id, name) DO NOTHING;

-- Insert subtypes for Graph
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'BFS (Breadth First Search)' FROM types t WHERE t.name = 'Graph'
UNION ALL
SELECT t.id, 'DFS (Depth First Search)' FROM types t WHERE t.name = 'Graph'
UNION ALL
SELECT t.id, 'Dijkstra\'s Algorithm' FROM types t WHERE t.name = 'Graph'
ON CONFLICT (type_id, name) DO NOTHING;

-- Insert subtypes for Linear (Data Structure)
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'Array' FROM types t WHERE t.name = 'Linear' AND t.category_id = (SELECT id FROM categories WHERE name = 'dataStructure')
UNION ALL
SELECT t.id, 'Linked List' FROM types t WHERE t.name = 'Linear' AND t.category_id = (SELECT id FROM categories WHERE name = 'dataStructure')
UNION ALL
SELECT t.id, 'Stack' FROM types t WHERE t.name = 'Linear' AND t.category_id = (SELECT id FROM categories WHERE name = 'dataStructure')
UNION ALL
SELECT t.id, 'Queue' FROM types t WHERE t.name = 'Linear' AND t.category_id = (SELECT id FROM categories WHERE name = 'dataStructure')
ON CONFLICT (type_id, name) DO NOTHING;

-- Insert subtypes for Non-Linear (Data Structure)
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'Tree' FROM types t WHERE t.name = 'Non-Linear' AND t.category_id = (SELECT id FROM categories WHERE name = 'dataStructure')
UNION ALL
SELECT t.id, 'Graph' FROM types t WHERE t.name = 'Non-Linear' AND t.category_id = (SELECT id FROM categories WHERE name = 'dataStructure')
ON CONFLICT (type_id, name) DO NOTHING;

-- Insert subtypes for Time Complexity
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'Big O Notation' FROM types t WHERE t.name = 'Time Complexity'
UNION ALL
SELECT t.id, 'Theta Notation' FROM types t WHERE t.name = 'Time Complexity'
UNION ALL
SELECT t.id, 'Omega Notation' FROM types t WHERE t.name = 'Time Complexity'
ON CONFLICT (type_id, name) DO NOTHING;

-- Insert subtypes for Space Complexity
INSERT INTO subtypes (type_id, name)
SELECT t.id, 'Big O Space' FROM types t WHERE t.name = 'Space Complexity'
UNION ALL
SELECT t.id, 'Auxiliary Space' FROM types t WHERE t.name = 'Space Complexity'
ON CONFLICT (type_id, name) DO NOTHING;

-- ============================================
-- CREATE DEFAULT ADMIN USER
-- Password: admin123 (change after first login)
-- ============================================
-- The hash below is for 'admin123' using bcrypt (cost 10)
INSERT INTO users (email, password_hash, username, role, is_verified) VALUES (
    'tseprosper02@gmail.com',
    '$2b$10$PaxG9DLuyHf8UsF2A9x1YeNhlUQsnwnJsqmXquX1Hj7Qbtc.V4.3m',
    'tseprosper02',
    'admin',
    TRUE
) ON CONFLICT (email) DO NOTHING;

-- ============================================
-- CREATE SAMPLE FILE (Bubble Sort)
-- ============================================
DO $$
DECLARE
    subtype_id INTEGER;
    file_id INTEGER;
    quiz_id INTEGER;
BEGIN
    -- Get Bubble Sort subtype id
    SELECT id INTO subtype_id FROM subtypes WHERE name = 'Bubble Sort' LIMIT 1;
    
    IF subtype_id IS NOT NULL THEN
        -- Insert sample file
        INSERT INTO files (subtype_id, name, notes, demo_code) VALUES (
            subtype_id,
            'bubble_sort.py',
            '# Bubble Sort

Bubble Sort is the simplest sorting algorithm that works by repeatedly swapping adjacent elements if they are in the wrong order.

## How it works:
1. Compare each pair of adjacent elements
2. Swap them if they are in the wrong order
3. Repeat until no swaps are needed

## Time Complexity:
- Best: O(n)
- Average: O(n²)
- Worst: O(n²)

## Space Complexity: O(1)',
            '<!DOCTYPE html>
<html>
<head>
    <title>Bubble Sort Visualization</title>
    <style>
        body { font-family: Arial; padding: 20px; }
        .array-container { display: flex; gap: 5px; margin: 20px 0; align-items: flex-end; }
        .bar { background-color: #3b82f6; width: 40px; transition: all 0.3s; text-align: center; color: white; }
        button { padding: 10px 20px; margin: 5px; cursor: pointer; background: #3b82f6; color: white; border: none; border-radius: 5px; }
    </style>
</head>
<body>
    <h2>Bubble Sort Visualizer</h2>
    <div class="array-container" id="arrayContainer"></div>
    <button onclick="startSort()">Start Bubble Sort</button>
    <button onclick="resetArray()">Reset Array</button>
    <script>
        let array = [64, 34, 25, 12, 22, 11, 90];
        
        function displayArray() {
            const container = document.getElementById("arrayContainer");
            container.innerHTML = "";
            array.forEach(value => {
                const bar = document.createElement("div");
                bar.className = "bar";
                bar.style.height = value * 3 + "px";
                bar.textContent = value;
                container.appendChild(bar);
            });
        }
        
        async function startSort() {
            for(let i = 0; i < array.length-1; i++) {
                for(let j = 0; j < array.length-i-1; j++) {
                    if(array[j] > array[j+1]) {
                        [array[j], array[j+1]] = [array[j+1], array[j]];
                        displayArray();
                        await new Promise(resolve => setTimeout(resolve, 500));
                    }
                }
            }
        }
        
        function resetArray() {
            array = [64, 34, 25, 12, 22, 11, 90];
            displayArray();
        }
        
        displayArray();
    </script>
</body>
</html>'
        ) RETURNING id INTO file_id;
        
        -- Insert sample example codes
        INSERT INTO example_codes (file_id, language, code, order_index) VALUES
        (file_id, 'python', 'def bubble_sort(arr):
    n = len(arr)
    for i in range(n-1):
        for j in range(n-i-1):
            if arr[j] > arr[j+1]:
                arr[j], arr[j+1] = arr[j+1], arr[j]
    return arr', 1),
        (file_id, 'javascript', 'function bubbleSort(arr) {
    for(let i = 0; i < arr.length-1; i++) {
        for(let j = 0; j < arr.length-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                [arr[j], arr[j+1]] = [arr[j+1], arr[j]];
            }
        }
    }
    return arr;
}', 1),
        (file_id, 'cpp', 'void bubbleSort(int arr[], int n) {
    for(int i = 0; i < n-1; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}', 1),
        (file_id, 'java', 'void bubbleSort(int arr[]) {
    int n = arr.length;
    for(int i = 0; i < n-1; i++) {
        for(int j = 0; j < n-i-1; j++) {
            if(arr[j] > arr[j+1]) {
                int temp = arr[j];
                arr[j] = arr[j+1];
                arr[j+1] = temp;
            }
        }
    }
}', 1);
        
        -- Insert sample quiz
        INSERT INTO quizzes (file_id, title) VALUES (file_id, 'Bubble Sort Quiz') RETURNING id INTO quiz_id;
        
        INSERT INTO quiz_questions (quiz_id, question_text, option_a, option_b, option_c, option_d, correct_option, order_index) VALUES
        (quiz_id, 'What is the time complexity of Bubble Sort in worst case?', 'O(n)', 'O(n log n)', 'O(n²)', 'O(log n)', 'C', 1),
        (quiz_id, 'What is the space complexity of Bubble Sort?', 'O(1)', 'O(n)', 'O(n²)', 'O(log n)', 'A', 2),
        (quiz_id, 'When is Bubble Sort efficient?', 'When array is reverse sorted', 'When array is already sorted', 'When array has duplicate elements', 'Never', 'B', 3);
    END IF;
END $$;

-- ============================================
-- VERIFY ALL TABLES CREATED
-- ============================================
DO $$
DECLARE
    tables_missing TEXT := '';
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN tables_missing := tables_missing || 'users, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'categories') THEN tables_missing := tables_missing || 'categories, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'types') THEN tables_missing := tables_missing || 'types, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'subtypes') THEN tables_missing := tables_missing || 'subtypes, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'files') THEN tables_missing := tables_missing || 'files, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'example_codes') THEN tables_missing := tables_missing || 'example_codes, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quizzes') THEN tables_missing := tables_missing || 'quizzes, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'quiz_questions') THEN tables_missing := tables_missing || 'quiz_questions, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'user_quiz_attempts') THEN tables_missing := tables_missing || 'user_quiz_attempts, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'chat_messages') THEN tables_missing := tables_missing || 'chat_messages, '; END IF;
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'notifications') THEN tables_missing := tables_missing || 'notifications, '; END IF;
    
    IF tables_missing = '' THEN
        RAISE NOTICE '✅ All tables created successfully!';
    ELSE
        RAISE NOTICE '⚠️ Missing tables: %', tables_missing;
    END IF;
END $$;

-- ============================================
-- DONE
-- ============================================