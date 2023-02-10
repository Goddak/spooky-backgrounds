import React, { useCallback, useEffect, useRef, useState } from 'react';
import './App.css';

import backgroundUrls from './backgrounds';

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
	const [bgIndex, setBgIndex] = useState<number>(0)

	const cachedSetBackground = () => {
		// Ensure that containerRef is valid
		if (!containerRef || !containerRef.current) return;
		
		console.log('AHH fuck', bgIndex, backgroundUrls[bgIndex])
		// Set the background url of the container
		containerRef.current.style.backgroundImage = `url(${backgroundUrls[bgIndex]})`;

		// Increment the index
		if (bgIndex === (backgroundUrls.length - 1)) {
			setBgIndex(0);
		} else {
			setBgIndex(bgIndex + 1);
		}
	}

	useEffect(() => {
		cachedSetBackground();
	}, [])


	return (
		<div ref={containerRef} className="h-screen w-screen flex flex-col justify-between items-center bg-center bg-cover">
			<h1 className='text-white text-3xl text-opacity-90 p-8'>SPOOKY BG</h1>
			<div className='flex w-full justify-evenly'>
				<button className='rounded-full bg-neutral-900/90 p-10 m-6' >
					<img className="h-10" src="/next-icon.png" alt="Download background" onClick={cachedSetBackground}/>
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
