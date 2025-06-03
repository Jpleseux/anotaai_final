import { UserEntity } from "./entities/user.entity";

export interface AuthGatewayInterface {
  userValidatePassword(user: UserEntity, password: string): Promise<boolean>;
  encryptPassword(password: string): Promise<string>;
  tokenGenerate(input: UserEntity): Promise<string>;
  tokenDecoding(token: string): Promise<any>;
}
