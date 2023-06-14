import React, { useEffect, useState } from 'react';
import MusicPlayer from './MusicPlayer';

const MusicList = () => {
	const [musicList, setMusicList] = useState([]);
	const [selectedMusic, setSelectedMusic] = useState('');

	useEffect(() => {
		// Função para buscar a listagem de músicas da API
		const fetchMusicList = async () => {
			try {
				const response = await fetch('http://localhost:8080/list');
				const data = await response.json();
				console.log(data);
				setMusicList(data);
			} catch (error) {
				console.error('Erro ao buscar a listagem de músicas:', error);
			}
		};

		fetchMusicList();
	}, []);

	const handleMusicClick = (music) => {
		setSelectedMusic(music);
	};

	return (
		<div>
			<h1>Player Musicas React</h1>
			<div className='music-player-container'>
				<ul className='music-list'>
					{musicList.map((music, index) => (
						<li key={index}>
							<button
								className={`music-button ${selectedMusic.url === music.url ? 'selected' : ''}`}
								onClick={() => handleMusicClick(music)}>
								{music.name}
							</button>
						</li>
					))}
				</ul>
				{selectedMusic && <MusicPlayer music={selectedMusic} />}{' '}
			</div>
		</div>
	);
};

export default MusicList;
