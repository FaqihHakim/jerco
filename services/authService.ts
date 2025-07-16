import apiService from './api';
import { User, UserRole } from '../types';

export interface LoginCredentials {
  identifier: string; // username or email
  password?: string; // Password might be optional for other auth methods in future
}

export interface RegisterData {
  username: string;
  email: string;
  password?: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

// Mock database of users
const mockUsers: User[] = [
    { id: '0', username: 'AdminUser', email: 'admin@example.com', role: UserRole.ADMIN },
    { id: '1', username: 'TestUser', email: 'user@example.com', role: UserRole.CUSTOMER },
    { id: '2', username: 'PumaFan', email: 'pumafan@example.com', role: UserRole.CUSTOMER },
    { id: '3', username: 'AdidasLover', email: 'adidaslover@example.com', role: UserRole.CUSTOMER },
    { id: '4', username: 'PumaSupporter', email: 'pumasupporter@example.com', role: UserRole.CUSTOMER },
    { id: '5', username: 'LocalBrandHero', email: 'localhero@example.com', role: UserRole.CUSTOMER },
];

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  // MOCK IMPLEMENTATION
  console.log('Attempting login with:', credentials);
  const normalizedIdentifier = credentials.identifier.toLowerCase();
  
  const foundUser = mockUsers.find(u => 
    u.username.toLowerCase() === normalizedIdentifier || 
    u.email.toLowerCase() === normalizedIdentifier
  );

  if (foundUser) {
    let isValidPassword = false;
    if (foundUser.role === UserRole.ADMIN && credentials.password === 'adminpass') {
      isValidPassword = true;
    } else if (foundUser.role === UserRole.CUSTOMER && credentials.password === 'password123') {
      isValidPassword = true;
    }
    
    if (isValidPassword) {
        return new Promise(resolve => setTimeout(() => resolve({
            token: `fake-${foundUser.role}-token-for-${foundUser.id}`,
            user: foundUser,
        }), 500));
    }
  }

  return new Promise((_, reject) => setTimeout(() => reject(new Error('Invalid credentials')), 500));
};


export const register = async (userData: RegisterData): Promise<User> => {
  // MOCK IMPLEMENTATION
  console.log('Attempting registration for:', userData);
  if (mockUsers.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
    return new Promise((_, reject) => setTimeout(() => reject(new Error('Email already exists')), 500));
  }
  const newUser: User = { 
    id: Math.random().toString(36).substring(7), 
    username: userData.username, 
    email: userData.email, 
    role: UserRole.CUSTOMER
  };
  mockUsers.push(newUser);
  return new Promise(resolve => setTimeout(() => resolve(newUser), 500));
};

export const getMe = async (token: string): Promise<User> => {
  // MOCK IMPLEMENTATION
  console.log('Fetching current user with token:', token);
  const tokenParts = token.split('-for-');
  const userId = tokenParts.length > 1 ? tokenParts[1] : null;

  const user = mockUsers.find(u => u.id === userId);

  if (user && token.startsWith(`fake-${user.role}-token`)) {
    return new Promise(resolve => setTimeout(() => resolve(user), 300));
  }
  return new Promise((_, reject) => setTimeout(() => reject(new Error('Invalid token')), 300));
};

// New function to get all users for k-NN
export const getAllUsers = async (token: string): Promise<User[]> => {
    // In a real app, this would be a protected admin/service endpoint
    console.log("Fetching all users for recommendation engine", token);
    return new Promise(resolve => setTimeout(() => {
        // Return only customers for recommendation purposes
        resolve(mockUsers.filter(u => u.role === UserRole.CUSTOMER));
    }, 200));
}
