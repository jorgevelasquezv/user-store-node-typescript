import { JWTAdapter, envs } from '../../config';
import { UserModel } from '../../data';
import {
    CustomError,
    LoginUserDto,
    RegisterUserDto,
    UserEntity,
} from '../../domain';
import { EmailServices } from './email.service';

export class AuthService {
    constructor(
        private readonly jwt: JWTAdapter,
        private readonly emailServices: EmailServices
    ) {}

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

            this.sendEmailValidationLink(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);

            const token = await this.jwt.generatedToken({ id: userEntity.id });

            if (!token)
                throw CustomError.internalServer('Error generating token');

            return { user: userEntity, token };
        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {
        const existUser = await UserModel.findOne({
            email: loginUserDto.email,
        });

        if (!existUser)
            throw CustomError.notFound(
                `User with email ${loginUserDto.email} not found`
            );

        const isMatch = await existUser.comparePassword(loginUserDto.password);

        if (!isMatch) throw CustomError.badRequest('Invalid password or email');

        const { password, ...userEntity } = UserEntity.fromObject(existUser);

        const token = await this.jwt.generatedToken({ id: userEntity.id });

        if (!token) throw CustomError.internalServer('Error generating token');

        return { user: userEntity, token };
    }

    private sendEmailValidationLink = async (email: string) => {
        const token = await this.jwt.generatedToken({ email }, '1d');

        if (!token) throw CustomError.internalServer('Error generating token');

        const link = `${envs.WEB_SERVICE_URL}/auth/validate-email/${token}`;

        const htmlBody = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody,
        }

        const isSend =  await this.emailServices.sendEmail(options);

        if (!isSend) throw CustomError.internalServer('Error sending email');
        
        return true;
    };

    public async validateEmail(token: string) {
        const payload = await this.jwt.validateToken(token);

        if (!payload) throw CustomError.unauthorized('Invalid token');

        const { email } = payload as any;

        const user = await UserModel.findOne({ email });

        if (!user) throw CustomError.internalServer('Email not exists');

        user.emailVerified = true;

        await user.save();

        return true;
    }
}
