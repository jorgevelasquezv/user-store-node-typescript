import { Router } from 'express';
import { AuthController } from './controller';
import { AuthService } from '../services/auth.services';
import { JWTAdapter, envs } from '../../config';

export class AuthRoutes {
    static get routes(): Router {
        
        const router = Router();

        const jwt = new JWTAdapter(envs.JWT_SEED);

        const authService = new AuthService(jwt);

        const controller = new AuthController(authService);

        router.post('/login', controller.loginUser)
        router.post('/register', controller.registerUser)

        router.get('/validate-email/:token', controller.validateEmail)        

        return router;
    }
}
