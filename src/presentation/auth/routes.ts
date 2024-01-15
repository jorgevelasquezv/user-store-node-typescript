
import { Router } from 'express';
import { AuthController } from './controller';
import { JWTAdapter, envs } from '../../config';
import { AuthService, EmailServices } from '../services';

export class AuthRoutes {
    static get routes(): Router {
        const router = Router();

        const jwt = new JWTAdapter(envs.JWT_SEED);

        const emailServices = new EmailServices(envs.MAILER_SERVICE, envs.MAILER_EMAIL, envs.MAILER_SECRET_KEY)

        const authService = new AuthService(jwt, emailServices);

        const controller = new AuthController(authService);

        router.post('/login', controller.loginUser);
        router.post('/register', controller.registerUser);

        router.get('/validate-email/:token', controller.validateEmail);

        return router;
    }
}
