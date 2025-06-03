import api from './api';

// Types
export type List = {
  id: string;
  name: string;
  createdAt: string;
};

export type CreateListParams = {
  name: string;
};

export type UpdateListParams = {
  name: string;
};

// Get all lists
export const getLists = async (): Promise<List[]> => {
  try {
    const response = await api.get<List[]>('/lists');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get a specific list
export const getList = async (id: string): Promise<List> => {
  try {
    const response = await api.get<List>(`/api/lists/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create a new list
export const createList = async (params: CreateListParams): Promise<List> => {
  try {
    const response = await api.post<List>('/lists', params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update a list
export const updateList = async (id: string, params: UpdateListParams): Promise<List> => {
  try {
    const response = await api.put<List>(`/api/lists/${id}`, params);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete a list
export const deleteList = async (id: string): Promise<void> => {
  try {
    await api.delete(`/api/lists/${id}`);
  } catch (error) {
    throw error;
  }
};