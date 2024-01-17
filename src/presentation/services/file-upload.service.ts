import { CustomError } from './../../domain/errors/custom.error';
import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { UUIdAdapter } from '../../config';

export class FileUploadService {
    constructor(private readonly uuid = UUIdAdapter.v4) {}

    public async uploadSingle(
        file: UploadedFile,
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        const destination = this.checkFolder(folder);

        return this.uploadFile(file, validExtensions, destination);
    }

    public async uploadMultiple(
        files: UploadedFile[],
        folder: string = 'uploads',
        validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']
    ) {
        const destination = this.checkFolder(folder);
        const fileNames = await Promise.all(
            files.map(file =>
                this.uploadFile(file, validExtensions, destination)
            )
        );

        return fileNames;
    }

    private checkFolder(folder: string) {
        const destination = path.resolve(__dirname, '../../../', folder);
        if (!fs.existsSync(destination))
            fs.mkdirSync(destination, { recursive: true });
        return destination;
    }

    private uploadFile(
        file: UploadedFile,
        validExtensions: string[],
        destination: string
    ) {
        const fileExtension = file.mimetype.split('/').at(1) ?? '';

        if (!validExtensions.includes(fileExtension))
            throw CustomError.badRequest(
                `Invalid file extension: ${fileExtension}, valid ones ${validExtensions}`
            );

        const fileName = `${this.uuid()}.${fileExtension}`;

        file.mv(`${destination}/${fileName}`);

        return { fileName };
    }
}
