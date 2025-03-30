import React, { useState, useEffect } from 'react';
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
  28: _28,
  29: _29,
  30: _30,
  31: _31,
  32: _32,
  33: _33,
  34: _34,
  35: _35,
  36: _36,
  37: _37,
  38: _38,
  39: _39,
  40: _40,
  41: _41,
  42: _42,
  43: _43,
  44: _44,
  45: _45,
  46: _46,
  47: _47,
  48: _48,
  49: _49,
  50: _50,
  51: _51,
  52: _52,
  53: _53,
  54: _54,
  55: _55,
  56: _56,
  57: _57,
  58: _58,
  59: _59,
  60: _60,
  61: _61,
  62: _62,
  63: _63,
  64: _64,
  65: _65,
  66: _66,
  67: _67,
  68: _68,
  69: _69,
  70: _70,
  71: _71,
  72: _72,
  73: _73,
  74: _74,
  75: _75,
  76: _76,
  77: _77,
  78: _78
};

// Define available page numbers for each topic
const topics = {
  Normal: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32],
  Dance: [1, 2, 3, 4, 5],
  ArtsPersonality: [6, 7, 8, 9, 10, 11],
  ArtAward: [12, 13, 14, 15],
  MusicalInstrument: [16, 17, 18],
  Festival: [19, 20, 21, 22, 23, 24, 25],
  Fairs: [26, 27],
  PaintingDressTribes: [30, 31],
  Language: [32],
  Songs: [28, 29],
  FirstIndia: [33, 34, 35, 36],
  Sports: [37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],
  ImportantDates: [59, 60, 61],
  FamousPersonality: [57, 58],
  BookAndAuthor: [48, 49, 50, 51, 52, 53, 54, 55, 56],
  States: [62, 63, 64, 65, 66],
  Organization: [67, 68, 69, 70, 71],
  World: [72, 73, 74],
  FullForm: [75],
  ReligiousPlaces: [76, 77, 78]
};

import {
  _1, _2, _3, _4, _5, _6, _7, _8, _9, _10, _11, _12, _13, _14, _15, _16, _17, _18, _19, _20, _21, _22, _23, _24, _25, _26, _27, _28, _29, _30, _31, _32,
  _33, _34, _35, _36, _37, _38, _39, _40, _41, _42, _43, _44, _45, _46, _47, _48, _49, _50, _51, _52, _53, _54, _55, _56, _57, _58, _59, _60, _61, _62, _63, _64, _65, _66, _67, _68, _69, _70, _71, _72,
  _73, _74, _75, _76, _77, _78
} from './index.js';

const App = () => {
  const [number, setNumber] = useState(1);
  const [pnumber, setpNumber] = useState(1);
  const [ary, setAry] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState('Dance');
  const [checkedItems, setCheckedItems] = useState(() => {
    const savedCheckedItems = localStorage.getItem('checkedItems');
    return savedCheckedItems ? JSON.parse(savedCheckedItems) : {};
  });
  const [viewMode, setViewMode] = useState('Normal');

  // Function to shuffle the array
  const shuffleArray = (array) => {
    let shuffledArray = [...array];
    for (let i = shuffledArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledArray[i], shuffledArray[j]] = [shuffledArray[j], shuffledArray[i]];
    }
    return shuffledArray;
  };

  // Function to handle array updates based on pnumber and number
  const updateArray = (shouldShuffle = false) => {
    if (data[pnumber]) {
      let currentArray = [...data[pnumber]];
      if (shouldShuffle) {
        currentArray = shuffleArray(currentArray);
      }
      let repeatedArray = [];
      for (let item of currentArray) {
        for (let i = 0; i < number; i++) {
          repeatedArray.push(item);
        }
      }
      setAry(repeatedArray);
    }
  };

  // Save checkedItems to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('checkedItems', JSON.stringify(checkedItems));
  }, [checkedItems]);

  // Update array when pnumber or number changes (without auto-shuffling)
  useEffect(() => {
    updateArray();
  }, [pnumber, number]);

  // Handle checkbox changes
  const handleCheckboxChange = (point) => {
    setCheckedItems((prev) => ({
      ...prev,
      [selectedTopic]: {
        ...prev[selectedTopic],
        [point]: !prev[selectedTopic]?.[point],
      },
    }));
  };

  // Handle topic changes
  const handleTopicChange = (event) => {
    const selected = event.target.value;
    setSelectedTopic(selected);
    const availablePages = topics[selected];
    if (availablePages) {
      setpNumber(availablePages[0]);
    }
  };

  // Handle view mode changes
  const handleViewModeChange = (event) => {
    setViewMode(event.target.value);
  };

  // Handle clearing all checkboxes for the current topic
  const handleClearAll = () => {
    setCheckedItems((prev) => ({
      ...prev,
      [selectedTopic]: {},
    }));
  };

  // Handle page number changes with bounds checking
  const incrementPage = () => {
    const availablePages = topics[selectedTopic];
    if (availablePages) {
      setpNumber(prev => {
        const currentIndex = availablePages.indexOf(prev);
        if (currentIndex < availablePages.length - 1) {
          return availablePages[currentIndex + 1];
        }
        return prev;
      });
    }
  };

  const decrementPage = () => {
    const availablePages = topics[selectedTopic];
    if (availablePages) {
      setpNumber(prev => {
        const currentIndex = availablePages.indexOf(prev);
        if (currentIndex > 0) {
          return availablePages[currentIndex - 1];
        }
        return prev;
      });
    }
  };

  // Manual shuffle function
  const handleShuffle = () => {
    updateArray(true);
  };

  // Filter array based on view mode
  const filteredAry =
    viewMode === 'Marked'
      ? ary.filter((point) => checkedItems[selectedTopic]?.[point])
      : ary;

  return (
    <div>
      <div className='container'>
        {/* Topic dropdown */}
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

        {/* View mode dropdown */}
        <div className='dropdown'>
          <label htmlFor="viewMode">View Mode:</label>
          <select id="viewMode" value={viewMode} onChange={handleViewModeChange}>
            <option value="Normal">Normal</option>
            <option value="Marked">Marked</option>
          </select>
        </div>

        {/* Number controls */}
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

        {/* Page number controls */}
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

        {/* Shuffle button */}
        <div className='btn'>
          <div className='inbtn'>
            <button onClick={handleShuffle}>Shuffle List</button>
          </div>
        </div>

        {/* Clear All button */}
        <div className='btn'>
          <div className='inbtn'>
            <button onClick={handleClearAll}>Clear All</button>
          </div>
        </div>
      </div>

      {/* Display selected topic */}
      <h2>Selected Topic: {selectedTopic}</h2>

      {/* Display points */}
      <ul>
        {filteredAry.map((point, index) => (
          <div key={index}>
            <p>
              {point}
              <input
                type="checkbox"
                checked={checkedItems[selectedTopic]?.[point] || false}
                onChange={() => handleCheckboxChange(point)}
              />
            </p>
            <br />
          </div>
        ))}
      </ul>
    </div>
  );
};

export default App;
