export interface IProduct {
  id: string | undefined;
  title: string;
  description: string;
  price: number;
  stock: number;
  thumbnail: {
    id: string | undefined;
    url: string;
    name: string;
  };
  categories: [
    {
      id: string | undefined;
      title: string;
    },
  ];
}
