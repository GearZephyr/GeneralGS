import React, { useState, useEffect } from 'react';

const Test = ({ data, topics, selectedTopic, pnumber, config, onExit }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);

  // Generate questions when component mounts
  useEffect(() => {
    const generateQuestions = () => {
      let questionPool = [];
      
      if (config.type === 'page') {
        questionPool = [...data[pnumber]];
      } else {
        const pages = topics[selectedTopic];
        questionPool = pages.flatMap(page => [...data[page]]);
      }

      // Shuffle and select required number of questions
      const shuffled = shuffleArray(questionPool).slice(0, config.questionCount);
      
      // Format questions with options
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

  // Helper function to get wrong options
  const getWrongOptions = (pool, correctAnswer, count) => {
    const wrongAnswers = pool
      .filter(item => !item.includes(correctAnswer))
      .map(item => item.split('-')[1].trim());
    
    return shuffleArray([...new Set(wrongAnswers)]).slice(0, count);
  };

  // Shuffle array function
  const shuffleArray = (array) => {
    return [...array].sort(() => Math.random() - 0.5);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleNextQuestion = () => {
    // Update question with user's answer
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

    // Move to next question or end test
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

  if (questions.length === 0) return <div>Loading questions...</div>;

  if (testCompleted) {
    return (
      <div className="test-results">
        <h2>Test Completed!</h2>
        <p>Your score: {score} out of {questions.length}</p>
        <p>Percentage: {Math.round((score / questions.length) * 100)}%</p>
        
        <div className="result-buttons">
          <button onClick={handleShowResults}>View Results</button>
          <button onClick={handleRestartTest}>Restart Test</button>
          <button onClick={onExit}>Exit Test</button>
        </div>

        {showResult && (
          <div className="detailed-results">
            {questions.map((q, index) => (
              <div key={index} className={`question-result ${q.isCorrect ? 'correct' : 'incorrect'}`}>
                <p><strong>Q{index + 1}:</strong> {q.question}</p>
                <p>Your answer: {q.userAnswer}</p>
                <p>Correct answer: {q.answer}</p>
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
          Question {currentIndex + 1} of {questions.length}
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