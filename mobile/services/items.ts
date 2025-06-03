import api from './api';

// Types
export type Item = {
  id: string;
  name: string;
  listId: string;
  createdAt: string;
};

export type CreateItemParams = {
  name: string;
  listId: string;
};

export type UpdateItemParams = {
  name?: string;
  listId?: string;
};

// Get all items
export const getItems = async (): Promise<Item[]> => {
  try {
    const response = await api.get<Item[]>('/items');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get items for a specific list
export const getItemsByList = async (listId: string): Promise<Item[]> => {
  try {
    const response = await api.get<Item[]>('/items');
    // Filter items by listId since API doesn't provide direct endpoint
    return response.data.filter(item => item.listId === listId);
  } catch (error) {
    throw error;
  }
};

// Get a specific item
export const getItem = async (id: string): Promise<Item> => {
  try {
    const response = await api.get<Item>(`/api/items/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new item
export const createItem = async (params: CreateItemParams): Promise<Item> => {
  try {
    const response = await api.post<Item>('/items', params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update an item
export const updateItem = async (id: string, params: UpdateItemParams): Promise<Item> => {
  try {
    const response = await api.put<Item>(`/api/items/${id}`, params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete an item
export const deleteItem = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/items/${id}`);
  } catch (error) {
    throw error;
  }
};