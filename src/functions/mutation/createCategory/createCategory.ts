import { AppSyncResolverHandler } from "aws-lambda";
import { DynamoCategoryRepository } from "../../../database/DynamoCategoryRepository/DynamoCategoryRepository";
import {
  CategoryRepository,
  CategoryWriteModel,
} from "../../../database/types/CategoryRepository";
import {
  Mutation,
  MutationCreateCategoryArgs,
} from "../../../generated/graphql";
import { v4 } from "uuid";
import { ProductRepository } from "../../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../../database/DynamoProductRepository/DynamoProductRepository";

const categoryRepository: CategoryRepository = new DynamoCategoryRepository();
const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: AppSyncResolverHandler<
  MutationCreateCategoryArgs,
  Omit<Mutation["createCategory"], "products">
> = async (event) => {
  const id = v4();
  const { products } = event.arguments.input;

  if (products.length > 0) {
    await productRepository.findTransactionalByIds(products);
  }

  const category: CategoryWriteModel = {
    id: v4(),
    name: event.arguments.input.name,
    products,
  };

  await categoryRepository.create(category);
  await Promise.all(
    products.map(async (productId) =>
      productRepository.appendCategory(productId, id)
    )
  );

  return category;
};
