import { AppSyncResolverHandler } from "aws-lambda";
import {
  Mutation,
  MutationStartProcessingOrderArgs,
  OrderStatus,
} from "../../../generated/graphql";
import { OrderRepository } from "../../../database/types/OrderRepository";
import { DynamoOrderRepository } from "../../../database/DynamoOrderRepository/DynamoOrderRepository";

const orderRepository: OrderRepository = new DynamoOrderRepository();

export const handler: AppSyncResolverHandler<
  MutationStartProcessingOrderArgs,
  Mutation["startProcessingOrder"]
> = async (event) => {
  const order = await orderRepository.findById(event.arguments.id);
  await orderRepository.updateStatus(order.id, OrderStatus.Processing);

  return order;
};
