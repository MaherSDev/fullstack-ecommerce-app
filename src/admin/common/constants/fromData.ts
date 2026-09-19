import type { IInputList } from "@/interfaces"; 

export const USER_FORM_INPUTS: IInputList[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Full Name",
    type: "text",
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    type: "text",
    validation: {
      required: true,
      pattern: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
    },
  },
  {
    name: "username",
    label: "Username",
    placeholder: "Username",
    type: "text",
    validation: {
      required: true,
      minLength: 3,
    },
  },
];
export const ADDRESS_FORM_INPUTS: IInputList[] = [
  {
    name: "fullName",
    label: "Full Name",
    placeholder: "Full Name",
    type: "text",
    validation: {
      required: true,
      minLength: 3,
    },
  },
  {
    name: "addressLine1",
    label: "Address Line 1",
    placeholder: "Enter Address Line 1",
    type: "text",
    validation: {
      minLength: 3,
    },
  },
  {
    name: "addressLine2",
    label: "Address Line 2",
    placeholder: "Enter Address Line 2",
    type: "text",
    validation: {
      minLength: 3,
    },
  },
  {
    name: "postalCode",
    label: "Postal Code",
    placeholder: "Enter Postal Code",
    type: "text",
    validation: {
      required: true,
    },
  },
];


