import { PaginationDto } from './../../domain/dtos/shared/pagination.dto';
import { CategoryModel } from '../../data';
import { CreateCategoryDto, CustomError, UserEntity } from '../../domain';

export class CategoryServices {
    async createCategory(
        createCategoryDto: CreateCategoryDto,
        user: UserEntity
    ) {
        const categoryExist = await CategoryModel.findOne({
            name: createCategoryDto.name,
        });

        if (categoryExist)
            throw CustomError.badRequest(
                `The category with name ${createCategoryDto.name} already exists`
            );

        try {
            const category = new CategoryModel({
                ...createCategoryDto,
                user: user.id,
            });

            await category.save();

            return {
                id: category.id,
                name: category.name,
                available: category.available,
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategories(paginationDto: PaginationDto) {
        const { limit, page } = paginationDto;

        try {
            const [total, categories] = await Promise.all([
                CategoryModel.countDocuments(),
                CategoryModel.find()
                    .skip((page - 1) * limit)
                    .limit(limit),
            ]);

            return {
                page,
                limit,
                total,
                next: `/api/category?page=${page + 1}&limit=${limit}`,
                prev:
                    page - 1 > 0
                        ? `/api/category?page=${page - 1}&limit=${limit}`
                        : null,
                categories: categories.map(category => ({
                    id: category.id,
                    name: category.name,
                    available: category.available,
                })),
            };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    async getCategory(name: string) {
        const category = await CategoryModel.findOne({ name });

        if (!category)
            throw CustomError.notFound(`Category with name ${name} not found`);

        return {
            id: category.id,
            name: category.name,
            available: category.available,
        };
    }

    updateCategory = async (id: string, createCategoryDto: CreateCategoryDto) => {

        const category = await CategoryModel.findById(id);

        if (!category)
            throw CustomError.notFound(`Category with id ${id} not found`);

        
    };

    deleteCategory = async () => {
        return 'delete category';
    };
}
