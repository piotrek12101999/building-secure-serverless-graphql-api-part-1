import { AppSyncResolverHandler } from "aws-lambda";
import { Query, QueryGetOrdersArgs } from "../../../generated/graphql";
import { OrderRepository } from "../../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../../database/DynamoOrderRepository/DynamoOrderRepository";

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: AppSyncResolverHandler<
  QueryGetOrdersArgs,
  Query["getOrders"]
> = async (event) => {
  return orderRepository.findAllByPurchaserEmail(event.arguments.email);
};
