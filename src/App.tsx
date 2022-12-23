import React, { useEffect, useRef } from 'react';
import logo from './logo.svg';
import './App.css';
import dlIcon from "./dl-icon.png";

const bgNames: string[] = [
	"/bg-1.jpg",
	"/bg-2.jpg",
	"/bg-3.jpg",
	"/bg-4.jpg",
	"/bg-5.jpg",
	"/bg-6.jpg",
	"/bg-7.jpg",
	"/bg-8.jpg",
	"/bg-9.jpg",
	"/bg-10.jpg",
	"/bg-11.jpg",
	"/bg-12.jpg",
	"/bg-13.jpg",
	"/bg-14.jpg",
	"/bg-15.jpg",
];

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
		if (!containerRef || !containerRef.current || !bgNames || !bgNames.length) return;

		// Choose a random background image path
		const randomIndex = Math.floor(Math.random() * bgNames.length);
		const randomBgName = bgNames[randomIndex];

		// Set the background url of the container
		if (containerRef && containerRef.current) {
			containerRef.current.style.backgroundImage = `url(${randomBgName})`;
		}
	}

	useEffect(() => {
		setRandomBackground();
	}, [setRandomBackground])


	return (
		<div ref={containerRef} className="h-screen w-screen flex flex-col justify-end items-center bg-center bg-cover">
			<div className='flex w-full'>
				<button className='rounded-full bg-slate-600 text-white py-6 m-6 flex flex-1 justify-center' onClick={setRandomBackground}>Next</button>
				<button className='rounded-full bg-slate-600 text-white py-4 m-6 ml-0 flex flex-1 justify-center' onClick={() => {
					downloadBackgroundImage(containerRef)
				}}>
					<img className="h-10" src="/dl-icon.png" alt="Download background" />
				</button>
			</div>
		</div>
	);
}

export default App;
