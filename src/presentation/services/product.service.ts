import { PaginationDto } from './../../domain/dtos/shared/pagination.dto';
import { ProductModel } from '../../data';
import { CreateProductDto, CustomError } from '../../domain';

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
        const category = await ProductModel.findOne({ name });

        if (!category)
            throw CustomError.notFound(`Category with name ${name} not found`);

        return {
            id: category.id,
            name: category.name,
            available: category.available,
        };
    }

    async updateProduct(id: string, createCategoryDto: CreateProductDto) {
        const category = await ProductModel.findById(id);

        if (!category)
            throw CustomError.notFound(`Category with id ${id} not found`);
    }

    async deleteProduct() {
        return 'delete category';
    }
}
