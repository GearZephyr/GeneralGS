import React, { useState, useEffect } from 'react';

const Test = ({ data, topics, selectedTopic, pnumber, config, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  useEffect(() => {
    const generateQuestions = () => {
      let questionPool = [];
      
      if (config.type === 'page') {
        questionPool = [...data[pnumber]];
      } else {
        const pages = topics[selectedTopic];
        questionPool = pages.flatMap(page => [...data[page]]);
      }

      const shuffled = shuffleArray(questionPool).slice(0, config.questionCount);
      
      const formattedQuestions = shuffled.map(q => {
        const [questionPart, answerPart] = q.split('-').map(s => s.trim());
        const wrongOptions = getWrongOptions(questionPool, answerPart, config.optionsCount - 1);
        const options = shuffleArray([answerPart, ...wrongOptions]);
        
        return {
          question: questionPart,
          answer: answerPart,
          options,
          userAnswer: null,
          isCorrect: false
        };
      });

      setQuestions(formattedQuestions);
    };

    generateQuestions();
  }, []);

  const getWrongOptions = (pool, correctAnswer, count) => {
    const wrongAnswers = pool
      .filter(item => !item.includes(correctAnswer))
      .map(item => item.split('-')[1].trim());
    
    return shuffleArray([...new Set(wrongAnswers)]).slice(0, count);
  };

  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    const updatedQuestions = [...questions];
    const isCorrect = selectedOption === updatedQuestions[currentIndex].answer;
    
    updatedQuestions[currentIndex] = {
      ...updatedQuestions[currentIndex],
      userAnswer: selectedOption,
      isCorrect
    };

    setQuestions(updatedQuestions);
    
    if (isCorrect) {
      setScore(score + 1);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setSelectedOption(null);
    } else {
      setTestCompleted(true);
    }
  };

  const handleShowResults = () => {
    setShowResult(true);
  };

  const handleRestartTest = () => {
    setCurrentIndex(0);
    setSelectedOption(null);
    setScore(0);
    setTestCompleted(false);
    setShowResult(false);
  };

  if (questions.length === 0) return <div className="loading">Loading questions...</div>;

  if (testCompleted) {
    return (
      <div className="test-results">
        <h2>Test Completed!</h2>
        <p className="score-display">Your score: <span>{score}</span> out of <span>{questions.length}</span></p>
        <p className="percentage">Percentage: <span>{Math.round((score / questions.length) * 100)}%</span></p>
        
        <div className="result-buttons">
          <button className="view-results" onClick={handleShowResults}>View Results</button>
          <button className="restart-test" onClick={handleRestartTest}>Restart Test</button>
          <button className="exit-test" onClick={onExit}>Exit Test</button>
        </div>

        {showResult && (
          <div className="detailed-results">
            {questions.map((q, index) => (
              <div key={index} className={`question-result ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                <p className="question-text"><strong>Q{index + 1}:</strong> {q.question}</p>
                <p className="user-answer">Your answer: {q.userAnswer}</p>
                <p className="correct-answer">Correct answer: {q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="test-container">
      <div className="test-header">
        <h2>Test Mode ({config.type === 'page' ? `Page ${pnumber}` : selectedTopic})</h2>
        <div className="test-progress">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span className="score">Score: {score}</span>
        </div>
      </div>

      <div className="question-container">
        <h3>{currentQuestion.question}</h3>
        
        <div className="options-container">
          {currentQuestion.options.map((option, i) => (
            <div 
              key={i} 
              className={`option ${selectedOption === option ? 'selected' : ''}`}
              onClick={() => handleOptionSelect(option)}
            >
              {option}
            </div>
          ))}
        </div>
      </div>

      <div className="test-controls">
        <button 
          className="next-button"
          onClick={handleNextQuestion}
          disabled={!selectedOption}
        >
          {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Test'}
        </button>
      </div>
    </div>
  );
};

export default Test;