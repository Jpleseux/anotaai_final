import { AuthGatewayInterface } from "../../core/authGateway.interface";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";
import { UserEntity } from "../../core/entities/user.entity";
import "dotenv/config"

const secret = process.env.SECRET as string;

export class AuthGateway implements AuthGatewayInterface {
  async userValidatePassword(user: UserEntity, password: string): Promise<boolean> {
    return await bcrypt.compare(password, user.password);
  }

  async encryptPassword(password: string): Promise<string> {
    const salt = bcrypt.genSaltSync(12);
    return await bcrypt.hash(password, salt);
  }

  async tokenGenerate(input: UserEntity): Promise<string> {
    return await jwt.sign(input.toResponse(), secret);
  }

  async tokenDecoding(token: string): Promise<any> {
    try {
      return await jwt.verify(token, secret);
    } catch (error) {
      throw new Error(`Token inválido ${error}`);
    }
  }
} 