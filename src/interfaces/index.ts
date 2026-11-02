import type { ReactNode } from "react";

export interface ISidebarLinks {
  label: string;
  path: string;
  icon?: ReactNode;
  page?: ReactNode;
}

export interface INavLinks {
  topMenu: ISidebarLinks[];
  bottomMenu: ISidebarLinks[];
}

export interface IInputList {
  name: string | number | boolean;
  label: string;
  placeholder: string;
  type: "text" | "email" | "password" | "number";
  validation?: {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
  };
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
  phoneNumber: string;
  defaultAddress: IAddress;
  confirmed: boolean;
  blocked: boolean;
  role: IRole;
  avatar: IThumbnail;
  addresses: IAddress[] | null;
  createdAt: string;
}

export interface IRole {
  id: number;
  name: string;
  type: string;
}

export interface ICountry {
  documentId: string;
  id: number;
  name: string;
  currency: string;
  currencySymbol: string;
  phoneCode: string;
  emoji: string;
  iso2: string;
  postalCodeFormat: string;
  postalCodeRegex: string;
}

export interface ICity {
  documentId: string;
  id: number;
  name: string;
  isSupportedForShipping: boolean;
  country: ICountry | number;
}

export interface IAddress {
  documentId: string;
  id: number;
  city: ICity | null;
  country: ICountry | null;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  phoneNumber: string;
  fullName: string;
  user: number | undefined;
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
  sku: string;
  price: number;
  discount: number;
  stock: number;
  thumbnail?: IThumbnail;
  categories: ICategory[];
}
export interface ICategory {
  title: string;
  description: string;
  products?: IProduct[];
}

export interface ICartItem {
  documentId: string;
  product: IProduct;
  quantity: number;
  discount: number;
  totalPrice: number;
  active: boolean;
}
export interface ICart {
  data: ICartItem[];
  cartCost: number;
  totalQuantity: number;
	selectedQuantity: number;
  totalDiscount: number;
}
export interface IApiCart {
  sessionId: string;
  user?: IUserData | null;
  cart_items: IApiCartItem[];
}
export interface IApiCartItem {
  id: string;
  documentId: string;
  product: IProduct;
  quantity: number;
  price: number;
  discount: number;
  active: boolean;
  cart: IApiCart | number;
}

export interface IErrorMessage {
  error: {
    response: {
      data: {
        message: string;
      };
    };
  };
}
