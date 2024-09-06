
import React, { useState, useEffect } from 'react';
import { _1, _2, _3 ,_4,_5,_11, _12, _13 ,_14,_15,_6,_7,_8,_9,_10,_16,_17,_18,_19,_20
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
};

const App = () => {
  const [number, setNumber] = useState(1);  // This controls how many times each item is repeated
  const [pnumber, setpNumber] = useState(1);
  const [ary, setAry] = useState([]);

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

  return (
    <div>
      <div className='container'>
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
              <button onClick={() => setpNumber(p => Math.max(1, p - 1))}>-</button>
              <h3>{pnumber}</h3>
              <button onClick={() => setpNumber(p => p + 1)}>+</button>
            </div>
          </div>     
        </div>

        <div className='btn'>
          <div className='inbtn'>
            <button onClick={updateArray}>Shuffle List</button>
          </div>
        </div>
      </div>

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
