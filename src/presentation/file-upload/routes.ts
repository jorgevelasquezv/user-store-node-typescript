import { TypeMiddleware } from './../middlewares/type.middleware';
import { Router } from 'express';
import { FileUploadController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { FileUploadService } from '../services';
import { FileUploadMiddleware } from '../middlewares/file-upload.middleware';

export class FileUploadRoutes {
    static get routes(): Router {
        const router = Router();

        const services = new FileUploadService();
        const controller = new FileUploadController(services);

        router.use([AuthMiddleware.validateJWT]);
        router.use(FileUploadMiddleware.containFiles);
        router.use(TypeMiddleware.validTypes(['products', 'categories', 'users']));

        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFiles);

        return router;
    }
}
