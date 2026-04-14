import React, { useState, useEffect } from 'react';
import { submitQuiz } from '../../services/fileService';

const QuizTab = ({ quiz, fileId }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const questions = quiz.questions || [];
  
  useEffect(() => {
    setAnswers(new Array(questions.length).fill(null));
  }, [questions]);
  
  const handleAnswer = (option) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = option;
    setAnswers(newAnswers);
  };
  
  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleSubmit = async () => {
  // Check if all questions answered
  if (answers.some(a => a === null)) {
    alert('Please answer all questions before submitting.');
    return;
  }
  
  setLoading(true);
  try {
    const formattedAnswers = questions.map((q, idx) => ({
      question_id: q.id,
      selected_option: answers[idx]
    }));
    
    console.log('Submitting answers:', formattedAnswers);
    
    const response = await submitQuiz(fileId, formattedAnswers);
    console.log('Quiz response:', response);
    
    setResult(response);
    setSubmitted(true);
  } catch (error) {
    console.error('Failed to submit quiz', error);
    const errorMsg = error.response?.data?.error || error.message || 'Failed to submit quiz';
    alert(`Error: ${errorMsg}`);
  } finally {
    setLoading(false);
  }
};
  
  if (questions.length === 0) {
    return <div>No questions available for this quiz.</div>;
  }
  
  if (submitted && result) {
    return (
      <div className="quiz-result">
        <h3>Quiz Completed! 🎉</h3>
        <p>Your score: <strong>{result.score}%</strong></p>
        <p>{result.message}</p>
      </div>
    );
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  const options = ['A', 'B', 'C', 'D'];
  const optionTexts = [
    currentQuestion.option_a,
    currentQuestion.option_b,
    currentQuestion.option_c,
    currentQuestion.option_d
  ];
  
  return (
    <div>
      <div className="quiz-question">
        <div className="question-text">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="question-text">
          {currentQuestion.question_text}
        </div>
        <div className="options">
          {options.map((opt, idx) => (
            <label key={opt} className="option">
              <input
                type="radio"
                name="answer"
                value={opt}
                checked={answers[currentQuestionIndex] === opt}
                onChange={() => handleAnswer(opt)}
              />
              <span>
                <strong>{opt}.</strong> {optionTexts[idx]}
              </span>
            </label>
          ))}
        </div>
      </div>
      
      <div className="quiz-nav">
        <button onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
          ← Previous
        </button>
        {currentQuestionIndex === questions.length - 1 ? (
          <button className="submit-quiz" onClick={handleSubmit} disabled={loading}>
            {loading ? 'Submitting...' : 'Submit Quiz'}
          </button>
        ) : (
          <button onClick={handleNext}>
            Next →
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizTab;