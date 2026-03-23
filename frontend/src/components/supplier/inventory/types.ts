export interface Product {
    id: string;
    name: string;
    price: string;
    priceNum: number;
    desc: string;
    inv: string;
    invNum: number;
    status: string;
    invColor: string;
    verified: boolean;
    imageUrls?: string[];
  }
  
  export interface EditFormValues {
    name: string;
    price: number;
    desc: string;
    inventory: number;
    status: string;
  }
