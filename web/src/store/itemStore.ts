import { create } from 'zustand';
import { Item, CreateItemRequest, UpdateItemRequest } from '../types/api';
import * as itemService from '../services/itemService';

interface ItemState {
  items: Item[];
  currentItem: Item | null;
  isLoading: boolean;
  error: string | null;
  fetchItems: (listId?: string) => Promise<void>;
  fetchItem: (id: string) => Promise<void>;
  createItem: (data: CreateItemRequest) => Promise<Item>;
  updateItem: (id: string, data: UpdateItemRequest) => Promise<Item>;
  deleteItem: (id: string) => Promise<void>;
}

export const useItemStore = create<ItemState>((set) => ({
  items: [],
  currentItem: null,
  isLoading: false,
  error: null,

  fetchItems: async (listId?: string) => {
    set({ isLoading: true, error: null });

    try {
      const items = await itemService.getItems(listId);
      set({ items, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch items' 
      });
    }
  },

  fetchItem: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const item = await itemService.getItem(id);
      set({ currentItem: item, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch item' 
      });
    }
  },

  createItem: async (data: CreateItemRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newItem = await itemService.createItem(data);
      set(state => ({ 
        items: [...state.items, newItem],
        isLoading: false 
      }));
      return newItem;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to create item' 
      });
      throw error;
    }
  },

  updateItem: async (id: string, data: UpdateItemRequest) => {
    set({ isLoading: true, error: null });

    try {
      const updatedItem = await itemService.updateItem(id, data);
      
      set(state => ({
        items: state.items.map(item => 
          item.id === id ? updatedItem : item
        ),
        currentItem: state.currentItem?.id === id 
          ? updatedItem 
          : state.currentItem,
        isLoading: false
      }));
      
      return updatedItem;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update item' 
      });
      throw error;
    }
  },

  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await itemService.deleteItem(id);
      
      set(state => ({
        items: state.items.filter(item => item.id !== id),
        currentItem: state.currentItem?.id === id 
          ? null 
          : state.currentItem,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to delete item' 
      });
      throw error;
    }
  },
}));