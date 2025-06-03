import { get, post, put, del } from '../lib/api';
import { 
  List, 
  CreateListRequest, 
  UpdateListRequest 
} from '../types/api';

// Get all lists
export const getLists = async (): Promise<List[]> => {
  return await get<List[]>('/lists');
};

// Get a specific list by ID
export const getList = async (id: string): Promise<List> => {
  return await get<List>(`/lists/${id}`);
};

// Create a new list
export const createList = async (list: CreateListRequest): Promise<List> => {
  return await post<List>('/lists', list);
};

// Update a list
export const updateList = async (id: string, list: UpdateListRequest): Promise<List> => {
  return await put<List>(`/lists/${id}`, list);
};

// Delete a list
export const deleteList = async (id: string): Promise<void> => {
  await del(`/lists/${id}`);
};