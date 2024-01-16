import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { ProductService } from '../services';

export class ProductRoutes {
    static get routes(): Router {
        const router = Router();

        const productServices = new ProductService();

        const controller = new ProductController(productServices);

        router.get('/', controller.getProducts);
        router.get('/:name');
        router.post(
            '/',
            [AuthMiddleware.validateJWT],
            controller.createProduct
        );
        router.put('/:id');
        router.delete('/:id');

        return router;
    }
}
