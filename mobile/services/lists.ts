import api from './api';

// Types
export type List = {
  uuid: string;
  name: string;
  description?: string;
  userId: string;
  items: Item[];
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
};

export type Item = {
  uuid: string;
  name: string;
  description?: string;
  value?: number;
  userId: string;
};

export type CreateListParams = {
  name: string;
  description?: string;
};

export type UpdateListParams = {
  name: string;
  description?: string;
};

// Get all lists
export const getLists = async (): Promise<List[]> => {
  try {
    const response = await api.get<{data: List[]}>('/lists');
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific list
export const getList = async (uuid: string): Promise<List> => {
  try {
    const response = await api.get<{data: List}>(`/lists/${uuid}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Create a new list
export const createList = async (params: CreateListParams): Promise<List> => {
  try {
    const response = await api.post<{data: List}>('/lists', params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Update a list
export const updateList = async (uuid: string, params: UpdateListParams): Promise<List> => {
  try {
    const response = await api.put<{data: List}>(`/lists/${uuid}`, params);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

// Delete a list
export const deleteList = async (uuid: string): Promise<void> => {
  try {
    await api.delete(`/lists/${uuid}`);
  } catch (error) {
    throw error;
  }
};