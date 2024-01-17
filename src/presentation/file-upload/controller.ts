import { Request, Response } from 'express';
import { FileUploadService } from '../services';
import { CustomError } from '../../domain';
import { UploadedFile } from 'express-fileupload';

export class FileUploadController {
    constructor(private readonly fileUploadService: FileUploadService) {}

    uploadFile = (req: Request, res: Response) => {

        const { type } = req.params;

        const file = req.body.files.at(0) as UploadedFile;

        this.fileUploadService
            .uploadSingle(file, `uploads/${type}`)
            .then(file => {
                res.json(file);
            })
            .catch(error => {
                this.handlerError(error, res);
            });
    };

    uploadMultipleFiles = (req: Request, res: Response) => {
        const { type } = req.params;
        
        const files = req.body.files as UploadedFile[];

        this.fileUploadService
            .uploadMultiple(files, `uploads/${type}`)
            .then(file => {
                res.json(file);
            })
            .catch(error => {
                this.handlerError(error, res);
            });
    };

    private handlerError = (error: any, res: Response) => {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        return res.status(500).json({ error: 'Internal server error' });
    };
}
