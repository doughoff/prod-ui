export type Status = "ACTIVE" | "INACTIVE";
export type Role = "ADMIN" | "OPERATOR";
export type Unit = "UNITS" | "KG" | "L" | "OTHER";

export type StockMovementType =
  | "PURCHASE"
  | "ADJUST"
  | "SALE"
  | "PRODUCTION_OUT"
  | "PRODUCTION_IN";

export interface QueryResult<T> {
  totalCount: number;
  items: T[];
}

export interface User {
  id: string;
  status: Status;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Role[];
}

export interface Product {
  id: string;
  status: Status;
  barcode: string;
  name: string;
  unit: Unit;
  conversionFactor: number;
  batchControl: boolean;
  description?: string;
  stock: number;
  averageCost: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Entities {
  id: string;
  status: Status;
  name: string;
  ci?: string;
  ruc?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Recipe {
  recipeId: string;
  recipeGroupId: string;
  status: Status;
  name: string;
  productId: string;
  productName: string;
  productUnit: Unit;
  producedQuantity: number;
  revision: number;
  isCurrent: boolean;
  createdByUserId: string;
  createdByUserName: string;
  ingredients: Ingredient[];
  createdAt: Date;
}

export interface Ingredient {
  id: string;
  productId: string;
  productName: string;
  productUnit: Unit;
  recipeId: string;
  quantity: number;
  stock: number;
  averageCost: number;
}

export interface StockMovementItem {
  id: string;
  productId: string;
  productName: string;
  productUnit: Unit;
  quantity: number;
  price: number;
  batch: string;
  total: number;
}

export interface StockMovement {
  id: string;
  status: Status;
  type: StockMovementType;
  date: string;
  entityId?: string;
  entityName?: string;
  createdByUserId: string;
  createByUserName: string;
  cancelledByUserId?: string;
  cancelledByUserName?: string;
  total: number;
  items: StockMovementItem[];
  createdAt: Date;
  updatedAt: Date;
}
