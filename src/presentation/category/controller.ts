import { Request, Response } from 'express';
import { CreateCategoryDto, CustomError, PaginationDto } from '../../domain';
import { CategoryServices } from '../services/category.service';

export class CategoryController {
    constructor(private readonly categoryService: CategoryServices) {}

    createCategory = (req: Request, res: Response) => {
        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if (error) return this.handlerError(error, res);

        this.categoryService
            .createCategory(createCategoryDto!, req.body.user)
            .then(category => res.json(category))
            .catch(error => this.handlerError(error, res));
    };

    getCategories = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });
        
        this.categoryService
            .getCategories(paginationDto!)
            .then(categories => res.json(categories))
            .catch(error => this.handlerError(error, res));
    };

    getCategory = (req: Request, res: Response) => {
        const { name } = req.params;
        
        if (!name) return res.status(400).json({ error: 'Missing name' });

        this.categoryService
            .getCategory(name)
            .then(category => res.json(category))
            .catch(error => this.handlerError(error, res));
    };

    updateCategory = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) return res.status(400).json({ error: 'Missing id' });

        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if (error) return this.handlerError(error, res);

        this.categoryService
            .updateCategory(id, createCategoryDto!)
            .then(category => res.json(category))
            .catch(error => this.handlerError(error, res));
    };

    deleteCategory = (req: Request, res: Response) => {
        res.json('delete category');
    };

    private handlerError = (error: any, res: Response) => {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        return res.status(500).json({ error: 'Internal server error' });
    };
}
