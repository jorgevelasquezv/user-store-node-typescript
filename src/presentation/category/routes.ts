import { Router } from 'express';
import { CategoryController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { CategoryServices } from '../services/category.service';

export class CategoryRoutes {
    static get routes(): Router {
        const router = Router();

        const categoryServices = new CategoryServices();

        const controller = new CategoryController(categoryServices);

        router.get('/', controller.getCategories);
        router.get('/:name', controller.getCategory );
        router.post('/', [AuthMiddleware.validateJWT], controller.createCategory);
        router.put('/:id', );
        router.delete('/:id', );
        
        return router;
    }
}
