import { AppSyncResolverHandler } from "aws-lambda";
import { Query } from "../../../generated/graphql";
import { ProductRepository } from "../../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../../database/DynamoProductRepository/DynamoProductRepository";
import { formatPrice } from "../../../utils/formatPrice";

const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: AppSyncResolverHandler<
  {},
  Omit<Query["getProducts"], "categories">
> = async () => {
  const products = await productRepository.findAll();

  return products.map(({ price, ...product }) => ({
    ...product,
    price: formatPrice(price),
  }));
};
