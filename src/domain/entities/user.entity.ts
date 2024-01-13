import { CustomError } from '../errors/custom.error';

export class UserEntity {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly emailVerified: boolean,
        public readonly password: string,
        public readonly roles: string[],
        public readonly img?: string
    ) {}

    static fromObject(object: any): UserEntity {
        const { _id, id, name, email, emailVerified, password, roles, img } =
            object;

        if (!_id && !id) {
            throw CustomError.badRequest('Missing id');
        }

        if (!name) {
            throw CustomError.badRequest('Missing name');
        }

        if (!email) {
            throw CustomError.badRequest('Missing email');
        }

        if (emailVerified === undefined) {
            throw CustomError.badRequest('Missing emailVerified');
        }

        if (!password) {
            throw CustomError.badRequest('Missing password');
        }

        if (!roles) {
            throw CustomError.badRequest('Missing roles');
        }

        return new UserEntity(
            _id || id,
            name,
            email,
            emailVerified,
            password,
            roles,
            img
        );
    }
}
