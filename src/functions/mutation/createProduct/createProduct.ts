import { AppSyncResolverHandler } from "aws-lambda";
import {
  Category,
  Mutation,
  MutationCreateProductArgs,
} from "../../../generated/graphql";
import {
  ProductRepository,
  ProductWriteModel,
} from "../../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../../database/DynamoProductRepository/DynamoProductRepository";
import { formatPrice } from "../../../utils/formatPrice";
import { v4 } from "uuid";
import { CategoryRepository } from "../../../database/types/CategoryRepository";
import { DynamoCategoryRepository } from "../../../database/DynamoCategoryRepository/DynamoCategoryRepository";

const productRepository: ProductRepository = new DynamoProductRepository();
const categoryRepository: CategoryRepository = new DynamoCategoryRepository();

export const handler: AppSyncResolverHandler<
  MutationCreateProductArgs,
  Omit<Mutation["createProduct"], "categories">
> = async (event) => {
  const id = v4();
  const { categories } = event.arguments.input;

  if (categories.length > 0) {
    await categoryRepository.findTransactionalByIds(categories);
  }

  const productWriteModel: ProductWriteModel = {
    ...event.arguments.input,
    id,
    created: new Date().toISOString(),
  };

  await productRepository.create(productWriteModel);
  await Promise.all(
    event.arguments.input.categories.map(async (categoryId) =>
      categoryRepository.appendProduct(categoryId, id)
    )
  );

  return {
    ...productWriteModel,
    price: formatPrice(productWriteModel.price),
  };
};
