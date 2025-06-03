export type ItemProps = {
  uuid: string;
  name: string;
  description: string;
  value: number;
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
};

export class ItemEntity {
  constructor(private props: ItemProps) {}

  get uuid(): string {
    return this.props.uuid;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description;
  }

  get value(): number {
    return this.props.value;
  }

  get userId(): string {
    return this.props.userId;
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

  set description(description: string) {
    this.props.description = description;
  }

  set value(value: number) {
    this.props.value = value;
  }

  output() {
    return {
      uuid: this.props.uuid,
      name: this.props.name,
      description: this.props.description,
      value: this.props.value,
      userId: this.props.userId,
      createdAt: this.props.createdAt,
      updatedAt: this.props.updatedAt,
      deletedAt: this.props.deletedAt,
    };
  }
}
