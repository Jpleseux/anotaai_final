import { create } from 'zustand';
import { List, CreateListRequest, UpdateListRequest } from '../types/api';
import * as listService from '../services/listService';

interface ListState {
  lists: List[];
  currentList: List | null;
  isLoading: boolean;
  error: string | null;
  fetchLists: () => Promise<void>;
  fetchList: (id: string) => Promise<void>;
  createList: (data: CreateListRequest) => Promise<List>;
  updateList: (id: string, data: UpdateListRequest) => Promise<List>;
  deleteList: (id: string) => Promise<void>;
}

export const useListStore = create<ListState>((set, get) => ({
  lists: [],
  currentList: null,
  isLoading: false,
  error: null,

  fetchLists: async () => {
    set({ isLoading: true, error: null });

    try {
      const lists = await listService.getLists();
      set({ lists, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch lists' 
      });
    }
  },

  fetchList: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      const list = await listService.getList(id);
      set({ currentList: list, isLoading: false });
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to fetch list' 
      });
    }
  },

  createList: async (data: CreateListRequest) => {
    set({ isLoading: true, error: null });

    try {
      const newList = await listService.createList(data);
      set(state => ({ 
        lists: [...state.lists, newList],
        isLoading: false 
      }));
      return newList;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to create list' 
      });
      throw error;
    }
  },

  updateList: async (id: string, data: UpdateListRequest) => {
    set({ isLoading: true, error: null });

    try {
      const updatedList = await listService.updateList(id, data);
      
      set(state => ({
        lists: state.lists.map(list => 
          list.id === id ? updatedList : list
        ),
        currentList: state.currentList?.id === id 
          ? updatedList 
          : state.currentList,
        isLoading: false
      }));
      
      return updatedList;
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to update list' 
      });
      throw error;
    }
  },

  deleteList: async (id: string) => {
    set({ isLoading: true, error: null });

    try {
      await listService.deleteList(id);
      
      set(state => ({
        lists: state.lists.filter(list => list.id !== id),
        currentList: state.currentList?.id === id 
          ? null 
          : state.currentList,
        isLoading: false
      }));
    } catch (error: any) {
      set({ 
        isLoading: false, 
        error: error.message || 'Failed to delete list' 
      });
      throw error;
    }
  },
}));