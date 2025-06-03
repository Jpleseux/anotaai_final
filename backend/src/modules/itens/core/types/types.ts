export type CreateItemInput = {
  name: string;
  description: string;
  value: number;
  userId: string;
};

export type UpdateItemInput = {
  uuid: string;
  name?: string;
  description?: string;
  value?: number;
  userId: string;
};

export type ItemOutput = {
  uuid: string;
  name: string;
  description: string;
  value: number;
  userId: string;
}; 