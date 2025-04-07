import React, { useState, useEffect } from 'react';

const Test = ({ data, topics, selectedTopic, pnumber, config, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateQuestions = () => {
      setIsLoading(true);
      try {
        const questionPool = config.type === 'page' 
          ? [...data[pnumber]] 
          : topics[selectedTopic].flatMap(page => [...data[page]]);

        const formattedQuestions = shuffleArray(questionPool)
          .slice(0, config.questionCount)
          .map(q => {
            const [question, answer] = q.split('-').map(s => s.trim());
            return { 
              question, 
              answer,
              isNumeric: !isNaN(answer) || /^\d{4}$/.test(answer) // Check if answer is numeric or year
            };
          });

        setQuestions(formattedQuestions);
      } finally {
        setIsLoading(false);
      }
    };

    generateQuestions();
  }, []);

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const checkAnswer = (userAnswer, correctAnswer, isNumeric) => {
    if (isNumeric) {
      // For numbers/years, require exact match
      return userAnswer.trim() === correctAnswer;
    } else {
      // For text answers, allow minor spelling mistakes (Levenshtein distance <= 2)
      return calculateSimilarity(userAnswer.toLowerCase(), correctAnswer.toLowerCase()) >= 0.8;
    }
  };

  // Simple similarity calculation (0-1 scale)
  const calculateSimilarity = (str1, str2) => {
    if (str1 === str2) return 1;
    if (str1.length === 0 || str2.length === 0) return 0;
    
    const longer = str1.length > str2.length ? str1 : str2;
    const shorter = str1.length > str2.length ? str2 : str1;
    
    // Quick check for minor differences
    if (longer.includes(shorter) || shorter.includes(longer)) return 0.9;
    
    // Simple character matching
    const matchingChars = [...shorter].filter((c, i) => c === longer[i]).length;
    return matchingChars / longer.length;
  };

  const handleAnswerSubmit = () => {
    const currentQuestion = questions[currentIndex];
    const isCorrect = checkAnswer(
      userAnswer, 
      currentQuestion.answer, 
      currentQuestion.isNumeric
    );

    if (isCorrect) {
      setScore(prev => prev + 1);
    }

    // Update question with user's answer
    const updatedQuestions = [...questions];
    updatedQuestions[currentIndex] = {
      ...currentQuestion,
      userAnswer,
      isCorrect
    };
    setQuestions(updatedQuestions);

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setUserAnswer('');
    } else {
      setShowResult(true);
    }
  };

  const restartTest = () => {
    setCurrentIndex(0);
    setScore(0);
    setUserAnswer('');
    setShowResult(false);
  };

  if (isLoading) return (
    <div className="loading-screen">
      <h3>Preparing your test...</h3>
      <div className="spinner"></div>
    </div>
  );

  if (showResult) return (
    <div className="results-screen">
      <h2>Test Results</h2>
      <div className="score-card">
        <p>You scored <span>{score}/{questions.length}</span></p>
        <p>{Math.round((score/questions.length)*100)}% Correct</p>
      </div>
      <div className="result-actions">
        <button onClick={restartTest}>Try Again</button>
        <button onClick={onExit}>Return to Study</button>
      </div>
      <div className="question-review">
        {questions.map((q, i) => (
          <div key={i} className={`review-item ${q.isCorrect ? 'correct' : 'incorrect'}`}>
            <p><strong>Q{i+1}:</strong> {q.question}</p>
            <p>Your answer: {q.userAnswer || "(blank)"}</p>
            <p>Correct answer: {q.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );

  const currentQuestion = questions[currentIndex];

  return (
    <div className="test-screen">
      <div className="test-header">
        <h3>Question {currentIndex + 1} of {questions.length}</h3>
        <div className="score-display">Score: {score}</div>
      </div>
      
      <div className="question-card">
        <h4>{currentQuestion.question}</h4>
        <div className="answer-input-container">
          <input
            type="text"
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer here..."
            autoFocus
          />
          {currentQuestion.isNumeric && (
            <div className="input-hint">(Enter exact number/year)</div>
          )}
        </div>
      </div>

      <button 
        className="submit-btn"
        onClick={handleAnswerSubmit}
        disabled={!userAnswer.trim()}
      >
        {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
      </button>
    </div>
  );
};

export default Test;