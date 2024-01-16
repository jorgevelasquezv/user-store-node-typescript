import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { ProductController } from './controller';
import { ProductService } from '../services';
import { ValidIdMiddleware } from '../middlewares/valid-id.middleware';

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
        router.put(
            '/:id',
            [AuthMiddleware.validateJWT, ValidIdMiddleware.validId],
            controller.updateProduct
        );
        router.delete(
            '/:id',
            [AuthMiddleware.validateJWT, ValidIdMiddleware.validId],
            controller.deleteProduct
        );

        return router;
    }
}
