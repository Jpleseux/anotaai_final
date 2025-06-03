export type CreateListInput = {
  name: string;
  description?: string;
  userId: string;
};

export type UpdateListInput = {
  uuid: string;
  name?: string;
  description?: string;
  userId: string;
};

export type ListOutput = {
  uuid: string;
  name: string;
  description?: string;
  userId: string;
  items: Array<{
    uuid: string;
    name: string;
    description: string;
    value: number;
    userId: string;
  }>;
  createdAt?: Date;
  updatedAt?: Date;
}; 