import React, { useState } from 'react';

const MusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audioElement = document.getElementById('audio');
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div>
      <audio id="audio" src="http://localhost:8080/musicas/Negro%20Amor.mp3" />
      <button onClick={togglePlay}>{isPlaying ? 'Pausar' : 'Reproduzir'}</button>
    </div>
  );
};

export default MusicPlayer;
