export type Status = "ACTIVE" | "INACTIVE";
export type Roles = "ADMIN" | "OPERATOR";
export type Units = "UNIT" | "KG" | "L" | "OTHER";

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
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateUser {
  name: string;
  email: string;
  password: string;
  roles: Roles[];
}
export interface CreateProduct {
  barcode: string;
  name: string;
  unit: Units;
  description?: string;
  conversionFactor: number;
  batchControl: boolean;
}
export interface EditUser {
  name: string;
  email: string;
  roles: Roles[];
  status: Status;
}
export interface EditProduct {
  barcode: string;
  name: string;
  unit: Units;
  description?: string;
  conversionFactor: number;
  batchControl: boolean;
  status: Status;
}
