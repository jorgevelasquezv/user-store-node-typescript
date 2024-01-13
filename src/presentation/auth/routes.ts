import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.services';

export class AuthRoutes {
    static get routes(): Router {
        
        const router = Router();

        const authService = new AuthService();

        const controller = new AuthController(authService);

        router.post('/login', controller.loginUser)
        router.post('/register', controller.registerUser)

        router.get('/validate-email/:token', controller.validateEmail)        

        return router;
    }
}
