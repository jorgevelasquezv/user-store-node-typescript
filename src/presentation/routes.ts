import { FileUploadRoutes } from './file-upload/routes';
import { Router } from 'express';
import { AuthRoutes } from './auth/routes';
import { CategoryRoutes } from './category/routes';
import { ProductRoutes } from './products/routes';
import { ImageRoute } from './images/routes';




export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/api/auth', AuthRoutes.routes );

    router.use('/api/category', CategoryRoutes.routes );
    
    router.use('/api/products', ProductRoutes.routes);
    
    router.use('/api/upload', FileUploadRoutes.routes);

    router.use('/api/images', ImageRoute.routes);


    return router;
  }


}

