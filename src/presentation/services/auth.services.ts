import { JWTAdapter } from '../../config';
import { UserModel } from '../../data';
import {
    CustomError,
    LoginUserDto,
    RegisterUserDto,
    UserEntity,
} from '../../domain';

export class AuthService {
    constructor(private jwt: JWTAdapter) {}

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

    public async loginUser(loginUserDto: LoginUserDto) {
        const existUser = await UserModel.findOne({
            email: loginUserDto.email,
        });

        if(!existUser) throw CustomError.notFound(`User with email ${loginUserDto.email} not found`);

        const isMatch = await existUser.comparePassword(loginUserDto.password);

        if (!isMatch) throw CustomError.badRequest('Invalid password or email');
        
        const { password, ...userEntity } = UserEntity.fromObject(existUser);

        const token = await this.jwt.generatedToken({ id: userEntity.id });
        
        if (!token) throw CustomError.internalServer('Error generating token');

        return { user: userEntity, token };
    }
}
