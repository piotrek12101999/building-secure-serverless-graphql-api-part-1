import { AppSyncResolverHandler } from "aws-lambda";
import { Category } from "../../../generated/graphql";
import { ProductRepository } from "../../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../../database/DynamoProductRepository/DynamoProductRepository";
import { formatPrice } from "../../../utils/formatPrice";

const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: AppSyncResolverHandler<
  {},
  Omit<Category["products"], "categories">
> = async (event) => {
  if (event.source!.products.length === 0) {
    return [];
  }

  const products = await productRepository.findTransactionalByIds(
    event.source!.products
  );

  return products.map(({ price, ...product }) => ({
    ...product,
    price: formatPrice(price),
  }));
};
