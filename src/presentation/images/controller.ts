import fs from 'fs';
import path from 'path';

import { Request, Response } from 'express';

export class ImageController {
    getImage = (req: Request, res: Response) => {
        const { type = '', img = '' } = req.params;
        
        const imagePath = path.resolve(
            __dirname,
            `../../../uploads/${type}/${img}`
        );

        if (!fs.existsSync(imagePath))
            return res.status(404).json({ error: 'Image not found' });

        res.sendFile(imagePath);
    };
}
