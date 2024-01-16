import { Validators } from '../../../config';

export class UpdateProductDto {
    private constructor(
        public readonly name?: string,
        public readonly available?: boolean,
        public readonly price?: number,
        public readonly description?: string,
        public readonly user?: string,
        public readonly category?: string
    ) {}

    public static create(props: {
        [key: string]: any;
    }): [string?, UpdateProductDto?] {
        const { name, available, price, description, user, category } = props;
        
        let availableBoolean = available;

        if (user.id && !Validators.isMongoId(user.id)) return ['Invalid user id'];

        if (category && !Validators.isMongoId(category))
            return ['Invalid category id'];

        if (available && typeof available !== 'boolean')
            availableBoolean = available !== 'false';
       
        if (price && typeof price !== 'number' && isNaN(Number(price)))
            return ['Price must be a number'];

        return [
            undefined,
            new UpdateProductDto(
                name,
                availableBoolean,
                price,
                description,
                user.id,
                category
            ),
        ];
    }
}
