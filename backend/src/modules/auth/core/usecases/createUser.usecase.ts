import { UserRepositoryInterface } from "../userRepository.interface";
import { AuthGatewayInterface } from "../authGateway.interface";
import { randomUUID } from "crypto";
import { UserEntity } from "../entities/user.entity";
import { AppError } from "../../../../core/errors/AppError";

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export class CreateUserUsecase {
  constructor(
    private userRepository: UserRepositoryInterface,
    private authGateway: AuthGatewayInterface
  ) {}

  async execute(input: CreateUserInput): Promise<void> {
    const { name, email, password } = input;

    const existingUser = await this.userRepository.findUserByEmail(email);
    if (existingUser) {
      throw new AppError("Usuário já existe");
    }

    const user = new UserEntity({
      uuid: randomUUID(),
      name: name,
      email: email,
      password: await this.authGateway.encryptPassword(password),
    });

    await this.userRepository.saveUser(user);
  }
}
