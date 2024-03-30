import {
  CategoryRepository,
  CategoryWriteModel,
} from "../types/CategoryRepository";
import { ProductWriteModel } from "../types/ProductRepository";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoCategoryRepository
  extends DynamoRepository<CategoryWriteModel>
  implements CategoryRepository
{
  constructor() {
    super("CATEGORY_TABLE");
  }

  async appendProduct(
    id: CategoryWriteModel["id"],
    productId: ProductWriteModel["id"]
  ): Promise<void> {
    return this.appendToList(id, productId, "products");
  }
}
