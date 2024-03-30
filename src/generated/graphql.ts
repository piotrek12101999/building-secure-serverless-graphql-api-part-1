export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  AWSDateTime: { input: any; output: any; }
  AWSEmail: { input: string; output: string; }
  AWSIPAddress: { input: any; output: any; }
  AWSJSON: { input: any; output: any; }
  AWSPhone: { input: any; output: any; }
  AWSTime: { input: any; output: any; }
  AWSTimestamp: { input: string; output: string; }
  AWSURL: { input: any; output: any; }
  BigInt: { input: any; output: any; }
  Double: { input: any; output: any; }
};

export type Category = {
  __typename?: 'Category';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  products?: Maybe<Array<Product>>;
};

export type CategoryInput = {
  name: Scalars['String']['input'];
  products: Array<Scalars['ID']['input']>;
};

export enum Currency {
  Gbp = 'GBP',
  Usd = 'USD'
}

export type Mutation = {
  __typename?: 'Mutation';
  completeOrder: Order;
  createCategory: Category;
  createProduct: Product;
  placeOrder: Order;
  startProcessingOrder: Order;
};


export type MutationCompleteOrderArgs = {
  id: Scalars['ID']['input'];
};


export type MutationCreateCategoryArgs = {
  input: CategoryInput;
};


export type MutationCreateProductArgs = {
  input: ProductInput;
};


export type MutationPlaceOrderArgs = {
  input: OrderInput;
};


export type MutationStartProcessingOrderArgs = {
  id: Scalars['ID']['input'];
};

export type Order = {
  __typename?: 'Order';
  created: Scalars['AWSDateTime']['output'];
  id: Scalars['ID']['output'];
  products?: Maybe<Array<Product>>;
  purchaserEmail: Scalars['AWSEmail']['output'];
  status: OrderStatus;
  totalPrice: Scalars['String']['output'];
};

export type OrderInput = {
  products: Array<Scalars['ID']['input']>;
  purchaserEmail: Scalars['AWSEmail']['input'];
};

export enum OrderStatus {
  Completed = 'COMPLETED',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

export type PriceInput = {
  amount: Scalars['Float']['input'];
  currency: Currency;
};

export type Product = {
  __typename?: 'Product';
  categories?: Maybe<Array<Category>>;
  created: Scalars['AWSDateTime']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  price: Scalars['String']['output'];
};

export type ProductInput = {
  categories: Array<Scalars['ID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  price: PriceInput;
};

export type Query = {
  __typename?: 'Query';
  getCategories?: Maybe<Array<Category>>;
  getOrders?: Maybe<Array<Order>>;
  getProducts?: Maybe<Array<Product>>;
};


export type QueryGetOrdersArgs = {
  email: Scalars['AWSEmail']['input'];
};
