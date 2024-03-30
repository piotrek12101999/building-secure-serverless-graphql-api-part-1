import { AppSyncResolverHandler } from "aws-lambda";
import {
  Category,
  Currency,
  Mutation,
  MutationPlaceOrderArgs,
  Order,
  OrderStatus,
  Product,
} from "../../../generated/graphql";
import { OrderRepository } from "../../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../../database/DynamoOrderRepository/DynamoOrderRepository";
import { v4 } from "uuid";
import { ProductRepository } from "../../../database/types/ProductRepository";
import { DynamoProductRepository } from "../../../database/DynamoProductRepository/DynamoProductRepository";
import { formatPrice } from "../../../utils/formatPrice";

const orderRepository: OrderRepository = new DynamoOrderRepository();
const productRepository: ProductRepository = new DynamoProductRepository();

export const handler: AppSyncResolverHandler<
  MutationPlaceOrderArgs,
  Mutation["placeOrder"]
> = async (event) => {
  const { products: productsInput, purchaserEmail } = event.arguments.input;

  if (productsInput.length === 0) {
    throw new Error("Order must have at least one product assigned to it");
  }

  const productWriteModels = await productRepository.findTransactionalByIds(
    productsInput
  );

  const summedAllCurrencies = productWriteModels.reduce<Record<string, number>>(
    (acc, { price }) => {
      if (acc[price.currency]) {
        return {
          ...acc,
          [price.currency]: acc[price.currency] + price.amount,
        };
      }

      return { ...acc, [price.currency]: price.amount };
    },
    {}
  );

  const totalPrice = Object.keys(summedAllCurrencies)
    .map((key) =>
      formatPrice({
        currency: key as Currency,
        amount: summedAllCurrencies[key],
      })
    )
    .join(", ");

  const products: Product[] = productWriteModels.map(
    ({ price, categories, ...product }) => ({
      ...product,
      // Here we must assert type ourself as the categories property is later on picked up by category field resolver
      categories: categories as unknown as Category[],
      price: formatPrice(price),
    })
  );

  const order: Order = {
    id: v4(),
    created: new Date().toISOString(),
    products,
    purchaserEmail,
    status: OrderStatus.Pending,
    totalPrice,
  };

  await orderRepository.create(order);

  return order;
};
