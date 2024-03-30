import { Product, PriceInput } from "../../generated/graphql";
import { CategoryWriteModel } from "./CategoryRepository";

export interface ProductWriteModel
  extends Omit<Product, "price" | "categories"> {
  price: PriceInput;
  categories: string[];
}

export interface ProductRepository {
  create(product: ProductWriteModel): Promise<void>;
  appendCategory(
    id: ProductWriteModel["id"],
    categoryId: CategoryWriteModel["id"]
  ): Promise<void>;
  findById(id: ProductWriteModel["id"]): Promise<ProductWriteModel>;
  findTransactionalByIds(
    ids: ProductWriteModel["id"][]
  ): Promise<ProductWriteModel[]>;
  findAll(): Promise<ProductWriteModel[]>;
}
