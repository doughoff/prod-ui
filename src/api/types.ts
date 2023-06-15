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
