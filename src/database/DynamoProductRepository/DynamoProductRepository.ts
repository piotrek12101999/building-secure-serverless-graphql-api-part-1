import {
  ProductRepository,
  ProductWriteModel,
} from "../types/ProductRepository";
import { Category } from "../../generated/graphql";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoProductRepository
  extends DynamoRepository<ProductWriteModel>
  implements ProductRepository
{
  constructor() {
    super("PRODUCT_TABLE");
  }

  async appendCategory(
    id: ProductWriteModel["id"],
    categoryId: Category["id"]
  ): Promise<void> {
    return this.appendToList(id, categoryId, "categories");
  }
}
