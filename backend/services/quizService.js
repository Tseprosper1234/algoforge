// services/quizService.js
async function calculateScore(questions, userAnswers) {
  let correct = 0;
  questions.forEach((q, idx) => {
    const userAnswer = userAnswers[idx]?.toUpperCase();
    if (userAnswer === q.correct_option) correct++;
  });
  return (correct / questions.length) * 100;
}

module.exports = { calculateScore };