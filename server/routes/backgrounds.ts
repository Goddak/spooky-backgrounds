import express, { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

type BackgroundData = {
	count: number;
	filenames: string[];
};

let backgrounds: BackgroundData = {
	count: 0,
	filenames: []
}

async function getImageInfo(folder: string): Promise<{ count: number, filenames: string[] }> {
	return new Promise((resolve, reject) => {
		fs.readdir(folder, (err, files) => {
			if (err) {
				reject(err);
			} else {
				const imageFiles = files.filter((file) => {
					const ext = path.extname(file).toLowerCase();
					return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
				});
				resolve({ count: imageFiles.length, filenames: imageFiles });
			}
		});
	});
}

getImageInfo(path.join(__dirname, '../../public/backgrounds/')).then(data => {
	console.log('Spooky Backgrounds :: Updated background data');
	backgrounds = data;
});

const router = express.Router();

router.get('/getBackgrounds', async (req: Request, res: Response) => {
	console.log('Spooky Backgrounds :: Request for background data');
	res.send(backgrounds);
});

router.get('/updateBackgrounds', async (req: Request, res: Response) => {
	try {
		let bgData: BackgroundData = await getImageInfo(path.join(__dirname, '../../public/backgrounds/'));
		backgrounds = bgData;
		res.send(bgData);
	} catch (error) {
		console.error(error);
		res.status(500).send({ message: 'An error occurred while getting the backgrounds' });
	}
});

export default router;