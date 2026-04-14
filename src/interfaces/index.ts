import type { ReactNode } from "react";

export interface INavLinks {
  label: string;
  path: string;
  icon?: ReactNode;
  page?: ReactNode;
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
  email: string;
}

export interface IProduct {
  id: string | undefined;
  documentId: string;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: {
    id: string | undefined;
    url: string;
    name: string;
    alternativeText: string;
  };
  categories: [
    {
      id: string | undefined;
      title: string;
    },
  ];
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
