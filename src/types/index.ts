export interface ShoppingList {
  id: string;
  name: string;
  isPublic: boolean;
  ownerId: string;
  isOwner?: boolean;
  createdAt: string;
  updatedAt: string;
  items: Array<{
    id: string;
    text: string;
    completed: boolean;
    createdAt: string;
  }>;
  sharedWith?: string[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  addedBy: string;
  addedAt: Date;
}

export interface User {
  email: string | null;
  createdAt: string;
  updatedAt: string;
  displayName: string;
  photoURL: string;
  lists: string[]; // Array de IDs das listas
} 