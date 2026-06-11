import type { ReactNode } from "react";

interface ISidebarLinks {
  label: string;
  path: string;
  icon?: ReactNode;
  page?: ReactNode;
}

export interface INavLinks {
  topMenu: ISidebarLinks[];
  bottomMenu: ISidebarLinks[];
}

export interface LoginFormFields {
  identifier: string;
  password: string;
  remember: boolean;
}
export interface IUserLogin {
  identifier: string;
  password: string;
}

export interface IUserData {
  id: number;
  documentId: string;
  username: string;
  password: string;
  email: string;
  fullName: string;
  confirmed: boolean;
  blocked: boolean;
  role: IRole;
  avatar: IThumbnail;
  address: IAddress;
  createdAt: string;
}

export interface IRole {
  id: number;
  name: string;
  type: string;
}

export interface IAddress {
  documentId: string;
  id: number;
  city: string;
  country: string;
  postalCode: number;
  streetAddress: string;
  state: string;
  users: IUserData[];
}

export interface IThumbnail {
  documentId: string;
  id: number;
  url: string;
  name: string;
  size: number;
  alternativeText: string;
}

export interface IProduct {
  id: string | undefined;
  documentId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail?: IThumbnail;
  categories: ICategory[];
}
export interface ICategory {
  id: string;
  documentId: string;
  title: string;
  description: string;
  products?: IProduct[];
}
export interface ICartItem {
  data: [
    {
      documentId: string;
      product: IProduct;
      quantity: number;
      totalPrice: number;
    },
  ];
  cartCost: number;
  totalQuantity: number;
}
