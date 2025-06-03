export type CreateUserInput = {
  name: string;
  email: string;
  password: string;
};
export type DefaultUserOutput = {
  name: string;
  email: string;
  isActive: boolean;
};
export type LoginInput = {
  email: string;
  password: string;
};
