import { Validators } from "../../../config";

export class CreateProductDto {
    private constructor(
        public readonly name: string,
        public readonly available: boolean,
        public readonly price: number,
        public readonly description: string,
        public readonly user: string,
        public readonly category: string
    ) {}

    public static create(props: {
        [key: string]: any;
    }): [string?, CreateProductDto?] {
        const { name, available, price, description, user, category } = props;

        let availableBoolean = available;
        if (!name) return ['Missing name property'];
        if (!user) return ['Missing user property'];

        const isUserValid = Validators.isMongoId(user);

        if (!isUserValid) return ['Invalid user id'];

        if (!category) return ['Missing category property'];

        const isCategoryValid = Validators.isMongoId(category);

        if (!isCategoryValid) return ['Invalid category id'];
        
        if (typeof available !== 'boolean')
            availableBoolean = available === 'false';
        if (price && typeof price !== 'number')
            return ['Price must be a number'];
        
        return [
            undefined,
            new CreateProductDto(
                name,
                availableBoolean,
                price,
                description,
                user,
                category
            ),
        ];
    }
}
