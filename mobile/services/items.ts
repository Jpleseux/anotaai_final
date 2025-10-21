import api from './api';

// Types
export type Item = {
  uuid: string;
  name: string;
  description: string;
  value: number;
  listId: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type CreateItemParams = {
  name: string;
  description: string;
  value: number;
  listId: string;
};

export type UpdateItemParams = {
  name?: string;
  description?: string;
  value?: number;
  listId?: string;
};

// Get all items
export const getItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get<{data: Item[]}>('items');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get items for a specific list
export const getItemsByList = async (listId: string): Promise<Item[]> => {
  try {
    const response = await api.get<{data: Item[]}>(`items/list/${listId}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific item
export const getItem = async (uuid: string): Promise<Item> => {
  try {
    const response = await api.get<{data: Item}>(`items/${uuid}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create a new item
export const createItem = async (params: CreateItemParams): Promise<Item> => {
  try {
    const response = await api.post<{data: Item}>('items', params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update an item
export const updateItem = async (uuid: string, params: UpdateItemParams): Promise<Item> => {
  try {
    const response = await api.put<{data: Item}>(`items/${uuid}`, params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete an item
export const deleteItem = async (uuid: string): Promise<void> => {
  try {
    await api.delete(`items/${uuid}`);
  } catch (error) {
    throw error;
  }
};