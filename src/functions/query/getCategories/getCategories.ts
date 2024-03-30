import { AppSyncResolverHandler } from "aws-lambda";
import { Query } from "../../../generated/graphql";
import { DynamoCategoryRepository } from "../../../database/DynamoCategoryRepository/DynamoCategoryRepository";
import { CategoryRepository } from "../../../database/types/CategoryRepository";

const categoryRepository: CategoryRepository = new DynamoCategoryRepository();

export const handler: AppSyncResolverHandler<
  {},
  Omit<Query["getCategories"], "products">
> = async () => {
  return categoryRepository.findAll();
};
