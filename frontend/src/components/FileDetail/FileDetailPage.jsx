import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getFileById } from '../../services/fileService';
import NotesTab from './NotesTab';
import ExampleCodesTab from './ExampleCodesTab';
import DemoTab from './DemoTab';
import QuizTab from './QuizTab';

const FileDetailPage = () => {
  const { id } = useParams();
  const [file, setFile] = useState(null);
  const [exampleCodes, setExampleCodes] = useState([]);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('notes');

  useEffect(() => {
    loadFile();
  }, [id]);

  const loadFile = async () => {
    try {
      const data = await getFileById(id);
      setFile(data.file);
      setExampleCodes(data.example_codes);
      setQuiz(data.quiz);
    } catch (error) {
      console.error('Failed to load file', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Loading...</div>;
  if (!file) return <div className="loading">File not found</div>;

  return (
    <>
      <div className="breadcrumb">
        <span className="breadcrumb-item">{file.name}</span>
      </div>
      
      <div className="tabs-container">
        <div className="tabs-header">
          <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>
            📝 Notes
          </button>
          <button className={`tab-btn ${activeTab === 'examples' ? 'active' : ''}`} onClick={() => setActiveTab('examples')}>
            💻 Example Codes
          </button>
          <button className={`tab-btn ${activeTab === 'demo' ? 'active' : ''}`} onClick={() => setActiveTab('demo')}>
            🎮 Demo
          </button>
          <button className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`} onClick={() => setActiveTab('quiz')}>
            📝 Quiz
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'notes' && <NotesTab notes={file.notes} />}
          {activeTab === 'examples' && <ExampleCodesTab codes={exampleCodes} />}
          {activeTab === 'demo' && <DemoTab demoCode={file.demo_code} />}
          {activeTab === 'quiz' && quiz && <QuizTab quiz={quiz} fileId={parseInt(id)} />}
          {activeTab === 'quiz' && !quiz && <div>No quiz available for this topic.</div>}
        </div>
      </div>
    </>
  );
};

export default FileDetailPage;