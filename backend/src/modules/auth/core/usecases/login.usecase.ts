import { UserRepositoryInterface } from "../userRepository.interface";
import { AuthGatewayInterface } from "../authGateway.interface";
import { AppError } from "../../../../core/errors/AppError";

interface LoginInput {
  email: string;
  password: string;
}

interface LoginOutput {
  user: {
    uuid: string;
    name: string;
    email: string;
  };
  token: string;
}

export class LoginUsecase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private authGateway: AuthGatewayInterface
  ) {}

  async execute(input: LoginInput): Promise<LoginOutput> {
    const { email, password } = input;

    const user = await this.userRepository.findUserByEmail(email);
    if (!user) {
      throw new AppError("Usuário não encontrado");
    }

    const passwordMatch = await this.authGateway.userValidatePassword(user, password);
    if (!passwordMatch) {
      throw new AppError("Senha incorreta");
    }

    const token = await this.authGateway.tokenGenerate(user);

    return {
      user: user.toResponse(),
      token,
    };
  }
}
