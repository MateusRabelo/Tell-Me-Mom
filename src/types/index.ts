export interface ShoppingList {
  id: string;
  name: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  sharedWith: string[];
  items: ShoppingItem[];
}

export interface ShoppingItem {
  id: string;
  name: string;
  quantity: number;
  checked: boolean;
  addedBy: string;
  addedAt: Date;
} 