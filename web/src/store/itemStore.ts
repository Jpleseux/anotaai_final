import { create } from 'zustand';
import { Item, CreateItemRequest, UpdateItemRequest } from '../types/api';
import * as itemService from '../services/itemService';

interface ItemState {
  items: Item[];
  currentItem: Item | null;
  isLoading: boolean;
  error: string | null;
  fetchItems: (listId?: string) => Promise<void>;
  fetchItem: (uuid: string) => Promise<void>;
  createItem: (data: CreateItemRequest) => Promise<Item>;
  updateItem: (uuid: string, data: UpdateItemRequest) => Promise<Item>;
  deleteItem: (uuid: string) => Promise<void>;
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

  fetchItem: async (uuid: string) => {
    set({ isLoading: true, error: null });

    try {
      const item = await itemService.getItem(uuid);
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

  updateItem: async (uuid: string, data: UpdateItemRequest) => {
    set({ isLoading: true, error: null });

    try {
      const updatedItem = await itemService.updateItem(uuid, data);
      
      set(state => ({
        items: state.items.map(item => 
          item.uuid === uuid ? updatedItem : item
        ),
        currentItem: state.currentItem?.uuid === uuid 
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

  deleteItem: async (uuid: string) => {
    set({ isLoading: true, error: null });

    try {
      await itemService.deleteItem(uuid);
      
      set(state => ({
        items: state.items.filter(item => item.uuid !== uuid),
        currentItem: state.currentItem?.uuid === uuid 
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