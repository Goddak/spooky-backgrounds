import React, { useEffect, useRef } from 'react';
import axios from 'axios';
import logo from './logo.svg';
import './App.css';

type BackgroundData = {
	count: number;
	filenames: string[];
}

class Backgrounds {
	bgData: BackgroundData = {
		count: 0,
		filenames: []
	}; // Declare the bgData variable

	constructor() {
		this.getBackgrounds(); // Call the getBackgrounds method when the class is instantiated
	}

	async getBackgrounds() {
		try {
			const response = await axios.get('/getBackgrounds');
			this.bgData = response.data as BackgroundData; // Save the data to the bgData variable
		} catch (error) {
			console.error(error);
		}
	}
}

const currentBackgrounds = new Backgrounds();

async function downloadBackgroundImage(elementRef: React.RefObject<HTMLDivElement>) {
	// Check if the elementRef is valid and has a non-null current property
	if (!elementRef || !elementRef.current) {
		return;
	}

	// Get the element's background image URL
	const element = elementRef.current;
	const style = window.getComputedStyle(element);
	const bgUrl = style.getPropertyValue('background-image').slice(4, -1).replace(/"/g, '');

	// Create a canvas and draw the image onto it
	const image = new Image();
	image.src = bgUrl;
	const canvas = document.createElement('canvas');
	const ctx = canvas.getContext('2d');
	if (!ctx) return;
	ctx.canvas.width = image.naturalWidth;
	ctx.canvas.height = image.naturalHeight;
	await new Promise((resolve) => image.onload = resolve);
	ctx.drawImage(image, 0, 0);

	const a = document.createElement('a');
	a.href = canvas.toDataURL();
	a.download = 'gdk-spooky-backgrounds.jpg';
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
}

function App() {
	const containerRef = useRef<HTMLDivElement>(null);

	function setRandomBackground(): void {
		// Ensure that containerRef and bgNames are valid
		if (!containerRef || !containerRef.current || !currentBackgrounds.bgData.filenames || !currentBackgrounds.bgData.count) return;

		// Choose a random background image path
		const randomIndex = Math.floor(Math.random() * currentBackgrounds.bgData.count);
		const randomBgName = currentBackgrounds.bgData.filenames[randomIndex];

		// Set the background url of the container
		if (containerRef && containerRef.current) {
			containerRef.current.style.backgroundImage = `url(/backgrounds/${randomBgName})`;
		}
	}

	useEffect(() => {
		setRandomBackground();
	}, [setRandomBackground])


	return (
		<div ref={containerRef} className="h-screen w-screen flex flex-col justify-end items-center bg-center bg-cover">
			<div className='flex w-full justify-evenly'>
				<button className='rounded-full bg-neutral-900/90 p-10 m-6' onClick={setRandomBackground}>
					<img className="h-10" src="/next-icon.png" alt="Download background" />
				</button>
				<button className='rounded-full bg-neutral-900/90 p-10 m-6' onClick={() => {
					downloadBackgroundImage(containerRef)
				}}>
					<img className="h-10" src="/dl-icon.png" alt="Download background" />
				</button>
			</div>
		</div>
	);
}

export default App;
