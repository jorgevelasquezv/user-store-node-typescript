export class PaginationDto{

    private constructor(
        public readonly page: number,
        public readonly limit: number
    ) { }

    static create(object: {[key: string]: any}):[string?, PaginationDto?]  {
        const { page = 1, limit = 5 } = object;

        if (isNaN(page) || isNaN(limit)) return ['Page and Limit must be numbers'];

        if (page <= 0) return ['Page must be greater than 0'];

        if (limit <= 0) return ['Limit must be greater than 0'];

        return [undefined, new PaginationDto(Number(page), Number(limit))];
        
    }
}