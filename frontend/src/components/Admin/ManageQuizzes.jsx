import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const ManageQuizzes = () => {
  const [files, setFiles] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState('');
  const [quizId, setQuizId] = useState(null);
  const [questionForm, setQuestionForm] = useState({
    quiz_id: '',
    question_text: '',
    option_a: '', option_b: '', option_c: '', option_d: '',
    correct_option: 'A'
  });
  
  useEffect(() => {
    loadData();
  }, []);
  
  const loadData = async () => {
    try {
      const [filesRes, quizzesRes] = await Promise.all([
        api.get('/admin/files'),
        api.get('/admin/quizzes')
      ]);
      setFiles(filesRes.data);
      setQuizzes(quizzesRes.data);
      if (quizzesRes.data.length > 0) {
        loadQuestions(quizzesRes.data[0].id);
      }
    } catch (error) {
      console.error('Failed to load data', error);
    } finally {
      setLoading(false);
    }
  };
  
  const loadQuestions = async (quizId) => {
    try {
      const response = await api.get(`/admin/quizzes/${quizId}/questions`);
      setQuestions(response.data);
    } catch (error) {
      console.error('Failed to load questions', error);
    }
  };
  
  const createQuiz = async () => {
    if (!selectedFile) return;
    try {
      await api.post('/admin/quizzes', { file_id: selectedFile, title: 'Quiz' });
      loadData();
    } catch (error) {
      console.error('Failed to create quiz', error);
      alert('Failed to create quiz');
    }
  };
  
  const addQuestion = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/quiz-questions', questionForm);
      setQuestionForm({
        quiz_id: quizId,
        question_text: '',
        option_a: '', option_b: '', option_c: '', option_d: '',
        correct_option: 'A'
      });
      loadQuestions(quizId);
    } catch (error) {
      console.error('Failed to add question', error);
      alert('Failed to add question');
    }
  };
  
  const deleteQuestion = async (id) => {
    try {
      await api.delete(`/admin/quiz-questions/${id}`);
      loadQuestions(quizId);
    } catch (error) {
      console.error('Failed to delete question', error);
      alert('Failed to delete question');
    }
  };
  
  if (loading) return <div className="loading">Loading...</div>;
  
  return (
    <div>
      <h3>Quiz Management</h3>
      
      <div className="list-card" style={{ padding: '20px', marginBottom: '20px' }}>
        <h4>Create Quiz for File</h4>
        <select value={selectedFile} onChange={(e) => setSelectedFile(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
          <option value="">Select File</option>
          {files.map(file => <option key={file.id} value={file.id}>{file.name}</option>)}
        </select>
        <button onClick={createQuiz} style={{ padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Create Quiz</button>
      </div>
      
      <h4>Existing Quizzes</h4>
      <div className="list-card" style={{ marginBottom: '20px' }}>
        {quizzes.map(quiz => {
          const file = files.find(f => f.id === quiz.file_id);
          return (
            <div key={quiz.id} className="list-item" onClick={() => { setQuizId(quiz.id); setQuestionForm({...questionForm, quiz_id: quiz.id}); loadQuestions(quiz.id); }}>
              <span>{file?.name} - {quiz.title || 'Quiz'}</span>
              <span className="chevron">›</span>
            </div>
          );
        })}
      </div>
      
      {quizId && (
        <>
          <h4>Add Question to Quiz</h4>
          <div className="list-card" style={{ padding: '20px', marginBottom: '20px' }}>
            <form onSubmit={addQuestion}>
              <textarea placeholder="Question Text" value={questionForm.question_text} onChange={(e) => setQuestionForm({...questionForm, question_text: e.target.value})} required rows="3" style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <input type="text" placeholder="Option A" value={questionForm.option_a} onChange={(e) => setQuestionForm({...questionForm, option_a: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <input type="text" placeholder="Option B" value={questionForm.option_b} onChange={(e) => setQuestionForm({...questionForm, option_b: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <input type="text" placeholder="Option C" value={questionForm.option_c} onChange={(e) => setQuestionForm({...questionForm, option_c: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <input type="text" placeholder="Option D" value={questionForm.option_d} onChange={(e) => setQuestionForm({...questionForm, option_d: e.target.value})} required style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }} />
              <select value={questionForm.correct_option} onChange={(e) => setQuestionForm({...questionForm, correct_option: e.target.value})} style={{ width: '100%', padding: '10px', marginBottom: '10px', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C">C</option>
                <option value="D">D</option>
              </select>
              <button type="submit" style={{ padding: '10px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>Add Question</button>
            </form>
          </div>
          
          <h4>Questions</h4>
          <div className="list-card">
            {questions.map((q, idx) => (
              <div key={q.id} className="list-item" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '8px' }}>
                <div><strong>Q{idx + 1}:</strong> {q.question_text}</div>
                <div style={{ fontSize: '0.85rem' }}>A: {q.option_a} | B: {q.option_b} | C: {q.option_c} | D: {q.option_d}</div>
                <div style={{ fontSize: '0.85rem', color: '#22c55e' }}>Correct: {q.correct_option}</div>
                <button onClick={() => deleteQuestion(q.id)} style={{ padding: '4px 12px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>Delete</button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ManageQuizzes;