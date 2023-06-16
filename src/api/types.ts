export type Status = "ACTIVE" | "INACTIVE";
export type Roles = "ADMIN" | "OPERATOR";
export type Units = "UNITS" | "KG" | "L" | "OTHER";

export interface User {
  id: string;
  status: Status;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Roles[];
}
export interface Product {
  id: string;
  status: Status;
  barcode: string;
  name: string;
  unit: Units;
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
  productUnit: Units;
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
  productUnit: Units;
  recipeId: string;
  quantity: number;
}
