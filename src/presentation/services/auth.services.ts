import { UserModel } from '../../data';
import { CustomError, RegisterUserDto, UserEntity } from '../../domain';

export class AuthService {
    constructor() {}

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({
            email: registerUserDto.email,
        });

        if (existUser)
            throw CustomError.badRequest(
                `The user with email ${registerUserDto.email} already exists`
            );

        try {
            const user = new UserModel(registerUserDto);

            user.password = await user.encryptPassword(user.password);

            await user.save();

            const { password, ...userEntity } = UserEntity.fromObject(user);

            return { user: userEntity, token: '123' };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }
}
