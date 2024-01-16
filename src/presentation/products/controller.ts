import { Request, Response } from 'express';
import {
    CreateCategoryDto,
    CreateProductDto,
    CustomError,
    PaginationDto,
} from '../../domain';
import { ProductService } from '../services';

export class ProductController {
    constructor(private readonly productService: ProductService) {}

    createProduct = (req: Request, res: Response) => {
        const [error, createProductDto] = CreateProductDto.create({
            ...req.body,
            user: req.body.user.id,
        });

        if (error) return res.status(400).json({ error });

        this.productService
            .createProduct(createProductDto!)
            .then(product => res.status(201).json(product))
            .catch(error => this.handlerError(error, res));
    };

    getProducts = (req: Request, res: Response) => {
        const [error, paginationDto] = PaginationDto.create(req.query);
        if (error) return res.status(400).json({ error });

        this.productService
            .getProducts(paginationDto!)
            .then(products => res.json(products))
            .catch(error => this.handlerError(error, res));
    };

    getProduct = (req: Request, res: Response) => {
        const { name } = req.params;

        if (!name) return res.status(400).json({ error: 'Missing name' });

        // this.productService
        //     .getCategory(name)
        //     .then(category => res.json(category))
        //     .catch(error => this.handlerError(error, res));
    };

    updateProduct = (req: Request, res: Response) => {
        const { id } = req.params;

        if (!id) return res.status(400).json({ error: 'Missing id' });

        const [error, createCategoryDto] = CreateCategoryDto.create(req.body);

        if (error) return this.handlerError(error, res);

        // this.productService
        //     .updateCategory(id, createCategoryDto!)
        //     .then(category => res.json(category))
        //     .catch(error => this.handlerError(error, res));
    };

    deleteProduct = (req: Request, res: Response) => {
        res.json('delete category');
    };

    private handlerError = (error: any, res: Response) => {
        if (error instanceof CustomError)
            return res.status(error.statusCode).json({ error: error.message });
        console.log({error});
        
        return res.status(500).json({ error: 'Internal server error' });
    };
}
