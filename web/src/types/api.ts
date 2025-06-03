// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  id: string;
  name: string;
  email: string;
}

// User types
export interface User {
  id: string;
  name: string;
  email: string;
}

// List types
export interface List {
  id: string;
  name: string;
  createdAt: string;
  items?: Item[];
}

export interface CreateListRequest {
  name: string;
}

export interface UpdateListRequest {
  name: string;
}

// Item types
export interface Item {
  id: string;
  name: string;
  listId: string;
  createdAt: string;
}

export interface CreateItemRequest {
  name: string;
  listId: string;
}

export interface UpdateItemRequest {
  name: string;
  listId: string;
}

// API Error types
export interface ApiError {
  message: string;
  statusCode: number;
}