import React, { useEffect, useState, useRef } from 'react';

const Typewriter = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  const intervalRef = useRef(null);
  const indexRef = useRef(0);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    indexRef.current = 0;
    setDisplayedText('');

    intervalRef.current = setInterval(() => {
      const currentChar = text[indexRef.current];
      setDisplayedText((prev) => prev + (currentChar === ' ' ? ' ' : currentChar));
      indexRef.current += 1;
      if (indexRef.current === text.length) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }, 35);

    return () => clearInterval(intervalRef.current);
  }, [text]);

  return <p>{displayedText}</p>;
};

export default Typewriter;