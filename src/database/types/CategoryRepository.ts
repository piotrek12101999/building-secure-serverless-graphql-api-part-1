import { Category } from "../../generated/graphql";
import { ProductWriteModel } from "./ProductRepository";

export interface CategoryWriteModel extends Omit<Category, "products"> {
  products: string[];
}

export interface CategoryRepository {
  create(category: CategoryWriteModel): Promise<void>;
  appendProduct(
    id: CategoryWriteModel["id"],
    productId: ProductWriteModel["id"]
  ): Promise<void>;
  findById(id: CategoryWriteModel["id"]): Promise<CategoryWriteModel>;
  findTransactionalByIds(
    ids: CategoryWriteModel["id"][]
  ): Promise<CategoryWriteModel[]>;
  findAll(): Promise<CategoryWriteModel[]>;
}
