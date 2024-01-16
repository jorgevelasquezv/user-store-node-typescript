import { PaginationDto } from './../../domain/dtos/shared/pagination.dto';
import { ProductModel } from '../../data';
import { CreateProductDto, CustomError, UpdateProductDto } from '../../domain';
import { Validators } from '../../config';
import { ObjectId } from 'mongoose';

export class ProductService {
    async createProduct(createProductDto: CreateProductDto) {
        const productExist = await ProductModel.findOne({
            name: createProductDto.name,
        });

        if (productExist)
            throw CustomError.badRequest(
                `The category with name ${createProductDto.name} already exists`
            );

        try {
            const product = new ProductModel(createProductDto);

            await product.save();

            return product;
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProducts(paginationDto: PaginationDto) {
        const { limit, page } = paginationDto;

        try {
            const [total, products] = await Promise.all([
                ProductModel.countDocuments(),
                ProductModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit)
                    .populate('user')
                    .populate('category'),
            ]);

            return {
                page,
                limit,
                total,
                next: `/api/products?page=${page + 1}&limit=${limit}`,
                prev:
                    page - 1 > 0
                        ? `/api/products?page=${page - 1}&limit=${limit}`
                        : null,
                products,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getProduct(name: string) {
        const product = await ProductModel.findOne({ name });

        if (!product)
            throw CustomError.notFound(`Category with name ${name} not found`);

        return product;
    }

    async updateProduct(id: string, updateProductDto: UpdateProductDto) {
        try {
            const productUpdate = await ProductModel.findByIdAndUpdate(
                id,
                { ...updateProductDto },
                { new: true }
            )
                .populate('user')
                .populate('category');

            if (!productUpdate)
                throw CustomError.notFound(`Product with id ${id} not found`);

            return productUpdate;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }

    async deleteProduct(id: string) {

        try {
            const deleteProduct = await ProductModel.findByIdAndDelete(id);
            if (!deleteProduct)
                throw CustomError.notFound(`Product with id ${id} not found`);
            return deleteProduct;
        } catch (error) {
            if (error instanceof CustomError) throw error;
            throw CustomError.internalServer(`${error}`);
        }
    }
}
