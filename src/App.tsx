import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import backgroundUrls from './backgrounds';

const getNextImageUrl: (index: number) => string = (index: number) => {
	if (index === (backgroundUrls.length - 1)) {
		return backgroundUrls[0];
	} else {
		return backgroundUrls[index + 1];
	}
}

const getPreviousImageUrl: (index: number) => string = (index: number) => {
	if (index === 0) {
		return backgroundUrls[backgroundUrls.length - 1];
	} else {
		return backgroundUrls[index - 1];
	}
}

const preloadImage: (url: string) => Promise<void> = (url: string) => {
	return new Promise((resolve) => {
		const image = new Image();
		image.src = url;
		image.onload = (e) => resolve();
	})
}

const preloadSurroundingImages: (index: number) => void = (index: number) => {
	const nextUrl = getNextImageUrl(index);
	const previousUrl = getPreviousImageUrl(index);
	preloadImage(nextUrl);
	preloadImage(previousUrl);
}

const setBackgroundImage: (elementRef: React.RefObject<HTMLDivElement>, url: string) => void = (elementRef: React.RefObject<HTMLDivElement>, url: string) => {
	// Ensure that elementRef is valid
	if (!elementRef || !elementRef.current) return;

	// fade to black
	elementRef.current.style.opacity = '0';
	setTimeout(() => {
		// Ensure that elementRef is valid
		if (!elementRef || !elementRef.current) return;
		// Set the background url of the container
		elementRef.current.style.backgroundImage = `url(${url})`;
		// fade back in
		elementRef.current.style.opacity = '1';
	}, 250);

	// // Set the background url of the container
	// elementRef.current.style.backgroundImage = `url(${url})`;
}

const updateCounter: (increment: boolean, setFn: React.Dispatch<React.SetStateAction<number>>) => void = (increment: boolean, setFn: React.Dispatch<React.SetStateAction<number>>) => {
	setFn((prev) => {
		if (increment) {
			if (prev === (backgroundUrls.length - 1)) {
				return 0;
			} else {
				return prev + 1;
			}
		} else {
			if (prev === 0) {
				return backgroundUrls.length - 1;
			} else {
				return prev - 1;
			}
		}
	})
	
}

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
	// Create a ref to the container element
	const containerRef = useRef<HTMLDivElement>(null);

	// Set the background image start index, this should be the index of the first image in the lastest image update.
	const [bgIndex, setBgIndex] = useState<number>(25 <= backgroundUrls.length ? 25 : 0)

	// Set the background image
	useEffect(() => {
		setBackgroundImage(containerRef, backgroundUrls[bgIndex]);
		preloadSurroundingImages(bgIndex);
	}, [containerRef, bgIndex])

	return (
		<div className="app-container h-screen w-screen ">
			<div className='absolute top-0 left-0 w-full h-full bg-black flex justify-center items-center z-10'>
				<h1 className='text-white text-3xl text-opacity-90 mt-2'>SPOOKY BGS</h1>
			</div>
			<div ref={containerRef} className="relative h-full flex flex-col justify-end items-center bg-center bg-cover transition-opacity z-20">
				<div className='flex w-full justify-evenly p-2 pt-8 bg-gradient-to-t from-black'>
					<img className="h-20" src="/previous-icon.svg" alt="Download background" onClick={() => updateCounter(false, setBgIndex)}/>
					<img className="h-20" src="/download-icon.svg" alt="Download background" onClick={() => {downloadBackgroundImage(containerRef)}}/>
					<img className="h-20" src="/next-icon.svg" alt="Download background" onClick={() => updateCounter(true, setBgIndex)}/>
				</div>
			</div>
		</div>
	);
}

export default App;
