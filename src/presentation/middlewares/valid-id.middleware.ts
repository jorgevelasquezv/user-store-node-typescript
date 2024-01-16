import { NextFunction, Request, Response } from 'express';
import { Validators } from '../../config';

export class ValidIdMiddleware {
    static get validId() {
        return (req: Request, res: Response, next: NextFunction) => {
            const { id } = req.params;
            if (!Validators.isMongoId(id)) {
                return res.status(400).json({
                    error: 'Invalid id',
                });
            }
            next();
        };
    }
}
