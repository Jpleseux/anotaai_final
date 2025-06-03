import { get, post, put, del } from '../lib/api';
import { 
  Item, 
  CreateItemRequest, 
  UpdateItemRequest 
} from '../types/api';

// Get all items (optionally filtered by listId)
export const getItems = async (listId?: string): Promise<Item[]> => {
  const query = listId ? `?listId=${listId}` : '';
  return await get<Item[]>(`/items${query}`);
};

// Get a specific item by ID
export const getItem = async (id: string): Promise<Item> => {
  return await get<Item>(`/items/${id}`);
};

// Create a new item
export const createItem = async (item: CreateItemRequest): Promise<Item> => {
  return await post<Item>('/items', item);
};

// Update an item
export const updateItem = async (id: string, item: UpdateItemRequest): Promise<Item> => {
  return await put<Item>(`/items/${id}`, item);
};

// Delete an item
export const deleteItem = async (id: string): Promise<void> => {
  await del(`/items/${id}`);
};