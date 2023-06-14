import { useEffect, useState } from 'react';
import useSound from 'use-sound'; // for handling the sound

import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai'; // icons for play and pause
import { BiSkipNext, BiSkipPrevious } from 'react-icons/bi'; // icons for next and previous track
import { IconContext } from 'react-icons'; // for customazing the icons

const MusicPlayer = (props) => {
	const [isPlaying, setIsPlaying] = useState(false);
	const [play, { pause, duration, sound }] = useSound(props.music.url);

	const [currTime, setCurrTime] = useState({
		min: '',
		sec: '',
	}); // current position of the audio in minutes and seconds

	const [seconds, setSeconds] = useState(); // current position of the audio in seconds

	const sec = duration / 1000;
	const min = Math.floor(sec / 60);
	const secRemain = Math.floor(sec % 60);
	const time = {
		min: min,
		sec: secRemain,
	};

	useEffect(() => {
		const interval = setInterval(() => {
			if (sound) {
				setSeconds(sound.seek([])); // setting the seconds state with the current state
				const min = Math.floor(sound.seek([]) / 60);
				const sec = Math.floor(sound.seek([]) % 60);
				setCurrTime({
					min,
					sec,
				});
			}
		}, 1000);
		return () => clearInterval(interval);
	}, [sound]);

	const playingButton = () => {
		if (isPlaying) {
			pause(); // this will pause the audio
			setIsPlaying(false);
		} else {
			play(); // this will play the audio
			setIsPlaying(true);
		}
	};

	return (
		<div className='component'>
			<img className='musicCover' src='https://picsum.photos/200/200' />
			<div>
				<h3 className='title'>{props.music.name}</h3>
			</div>
			<div>
				<button className='playButton'>
					<IconContext.Provider value={{ size: '3em', color: '#27AE60' }}>
						<BiSkipPrevious />
					</IconContext.Provider>
				</button>
				{!isPlaying ? (
					<button className='playButton' onClick={playingButton}>
						<IconContext.Provider value={{ size: '3em', color: '#27AE60' }}>
							<AiFillPlayCircle />
						</IconContext.Provider>
					</button>
				) : (
					<button className='playButton' onClick={playingButton}>
						<IconContext.Provider value={{ size: '3em', color: '#27AE60' }}>
							<AiFillPauseCircle />
						</IconContext.Provider>
					</button>
				)}
				<button className='playButton'>
					<IconContext.Provider value={{ size: '3em', color: '#27AE60' }}>
						<BiSkipNext />
					</IconContext.Provider>
				</button>
			</div>
			<div>
				<div className='time'>
					<p>
						{String(currTime.min).padStart(2, '0')}:{String(currTime.sec).padStart(2, '0')}
					</p>
					<p>
						{String(time.min).padStart(2, '0')}:{String(time.sec).padStart(2, '0')}
					</p>
				</div>
				<input
					type='range'
					min='0'
					max={duration / 1000}
					default='0'
					value={seconds}
					className='timeline'
					onChange={(e) => {
						sound.seek([e.target.value]);
					}}
				/>
			</div>
		</div>
	);
};

export default MusicPlayer;
