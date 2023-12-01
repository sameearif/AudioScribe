import React from 'react';
import ReactTypingEffect from 'react-typing-effect';
import './Typewriter.css';

const Typewriter = () => {
  return (
    <div className='typewriter-container'>
      <ReactTypingEffect
        text={["Youtube", "ASR", "FixScribe", "TTS"]}
        speed={200}
        eraseSpeed={200}
        typingDelay={0}
        eraseDelay={100}
      />
    </div>
  );
}

export default Typewriter;
