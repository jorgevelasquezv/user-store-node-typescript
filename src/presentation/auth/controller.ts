import { Request, Response } from 'express';
import { CustomError, RegisterUserDto } from '../../domain';
import { AuthService } from '../services/auth.services';

export class AuthController {
    constructor(public readonly authServices: AuthService) {}

    registerUser = (req: Request, res: Response) => {
        const [error, registerUserDto] = RegisterUserDto.create(req.body);
        if (error) return res.status(400).json({ error });

        this.authServices
            .registerUser(registerUserDto!)
            .then(user => res.json(user))
            .catch(error => this.handlerError(error, res));
    };

    loginUser = (req: Request, res: Response) => {
        res.json({ message: 'login' });
    };

    validateEmail = (req: Request, res: Response) => {
        res.json({ message: 'validate' });
    };

    private handlerError = (error: any, res: Response) => {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        return res.status(500).json({ error: 'Internal server error' });
    };
}