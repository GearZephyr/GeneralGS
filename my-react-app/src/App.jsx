import React, { useState, useEffect } from 'react';
import {
  _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27
} from './index.js'; // Import your arrays here
import './App.css';

// Map pnumber values to the corresponding arrays
const data = {
  1: _1,
  2: _2,
  3: _3,
  4: _4,
  5: _5,
  6: _6,
  7: _7,
  8: _8,
  9: _9,
  10: _10,
  11: _11,
  12: _12,
  13: _13,
  14: _14,
  15: _15,
  16: _16,
  17: _17,
  18: _18,
  19: _19,
  20: _20,
  21: _21,
  22: _22,
  23: _23,
  24: _24,
  25: _25,
  26: _26,
  27: _27,
};

// Define available page numbers for each topic
const topics = {
  Normal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27], // All page numbers
  Dance: [1, 2, 3, 4, 5], // Page numbers 1 to 5
  ArtsPersonality: [6, 7, 8, 9, 10, 11], // Page numbers 6 to 11
  ArtAward: [12, 13, 14, 15], // Page numbers 12 to 15
  MusicalInstrument: [16, 17, 18], // Page numbers 16 to 18
  Festival: [19, 20, 21, 22, 23, 24, 25], // Page numbers 19 to 25
  Fairs: [26, 27], // Page numbers 26 to 27
};

const App = () => {
  const [number, setNumber] = useState(1);  // Controls how many times each item is repeated
  const [pnumber, setpNumber] = useState(1); // Page number to show
  const [ary, setAry] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('Dance'); // State to store the selected topic

  // Function to shuffle the array
  function shuffleArray(array) {
    let shuffledArray = [...array]; // Create a copy to avoid mutating the original array
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray; // Return shuffled array without updating state
  }

  // Function to handle array updates based on pnumber and number
  function updateArray() {
    if (data[pnumber]) {
      let shuffledArray = shuffleArray(data[pnumber]);
      let repeatedArray = [];

      // Repeat each item `number` times in succession
      for (let item of shuffledArray) {
        for (let i = 0; i < number; i++) {
          repeatedArray.push(item);
        }
      }

      setAry(repeatedArray); // Update state with repeated and shuffled array
    }
  }

  // Use useEffect to shuffle the array whenever pnumber or number changes
  useEffect(() => {
    updateArray();
  }, [pnumber, number]);

  // Handle topic selection and set the corresponding page number
  const handleTopicChange = (event) => {
    const selected = event.target.value;
    setSelectedTopic(selected);

    // Ensure pnumber is within the range of the selected topic
    const availablePages = topics[selected];
    if (availablePages) {
      setpNumber((prev) => (availablePages.includes(prev) ? prev : availablePages[0]));
    }
  };

  // Handle incrementing and decrementing pnumber
  const incrementPage = () => {
    const availablePages = topics[selectedTopic];
    if (availablePages) {
      setpNumber((prev) => {
        const currentIndex = availablePages.indexOf(prev);
        return availablePages[(currentIndex + 1) % availablePages.length];
      });
    }
  };

  const decrementPage = () => {
    const availablePages = topics[selectedTopic];
    if (availablePages) {
      setpNumber((prev) => {
        const currentIndex = availablePages.indexOf(prev);
        return availablePages[(currentIndex - 1 + availablePages.length) % availablePages.length];
      });
    }
  };

  return (
    <div>
      <div className='container'>
        {/* Dropdown for topics */}
        <div className='dropdown'>
          <label htmlFor="topics">Select Topic:</label>
          <select id="topics" value={selectedTopic} onChange={handleTopicChange}>
            {Object.keys(topics).map((topic) => (
              <option key={topic} value={topic}>
                {topic}
              </option>
            ))}
          </select>
        </div>

        <div className='btn'>
          <div className='inbtn'>
            <h6>times</h6>
            <div className='inbtn'>
              <button onClick={() => setNumber(p => Math.max(1, p - 1))}>-</button>
              <h3>{number}</h3>
              <button onClick={() => setNumber(p => p + 1)}>+</button>
            </div>
          </div>
        </div>

        <div className='btn'>
          <div className='inbtn'>
            <h6>pg no</h6>
            <div className='inbtn'>
              <button onClick={decrementPage}>-</button>
              <h3>{pnumber}</h3>
              <button onClick={incrementPage}>+</button>
            </div>
          </div>
        </div>

        <div className='btn'>
          <div className='inbtn'>
            <button onClick={updateArray}>Shuffle List</button>
          </div>
        </div>
      </div>

      {/* Display the selected topic */}
      <h2>Selected Topic: {selectedTopic}</h2>

      {/* Display the points */}
      <ul>
        {ary.map((name, index) => (
          <div key={index}>
            <p>{name}</p><br />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default App;
