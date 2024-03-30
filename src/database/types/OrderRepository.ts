import { Order, OrderStatus } from "../../generated/graphql";

export interface OrderRepository {
  create(order: Order): Promise<void>;
  updateStatus(id: Order["id"], status: OrderStatus): Promise<void>;
  findById(id: Order["id"]): Promise<Order>;
  findAllByPurchaserEmail(email: Order["purchaserEmail"]): Promise<Order[]>;
}
