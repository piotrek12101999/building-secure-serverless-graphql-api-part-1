import { AppSyncResolverHandler } from "aws-lambda";
import {
  Mutation,
  MutationCompleteOrderArgs,
  OrderStatus,
} from "../../../generated/graphql";
import { OrderRepository } from "../../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../../database/DynamoOrderRepository/DynamoOrderRepository";

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: AppSyncResolverHandler<
  MutationCompleteOrderArgs,
  Mutation["completeOrder"]
> = async (event) => {
  const order = await orderRepository.findById(event.arguments.id);
  await orderRepository.updateStatus(order.id, OrderStatus.Completed);

  return order;
};
