export type UserProps = {
  uuid: string;
  name: string;
  email: string;
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export class UserEntity {
  constructor(private props: UserProps) {}

  get uuid(): string {
    return this.props.uuid;
  }

  get name(): string {
    return this.props.name;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date {
    return this.props.deletedAt;
  }

  set name(name: string) {
    this.props.name = name;
  }

  set email(email: string) {
    this.props.email = email;
  }

  set password(password: string) {
    this.props.password = password;
  }

  toModel() {
    return {
      uuid: this.props.uuid,
      name: this.props.name,
      email: this.props.email,
      password: this.props.password,
      created_at: this.props.createdAt,
      updated_at: this.props.updatedAt,
      deleted_at: this.props.deletedAt,
    };
  }

  toResponse() {
    return {
      uuid: this.props.uuid,
      name: this.props.name,
      email: this.props.email,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
    };
  }
} 