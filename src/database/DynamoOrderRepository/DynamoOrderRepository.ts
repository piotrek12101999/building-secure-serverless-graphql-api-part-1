import { Order, OrderStatus } from "../../generated/graphql";
import { OrderRepository } from "../types/OrderRepository";
import { UpdateCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { DynamoRepository } from "../DynamoRepository/DynamoRepository";

export class DynamoOrderRepository
  extends DynamoRepository<Order>
  implements OrderRepository
{
  constructor() {
    super("ORDER_TABLE");
  }

  async findAllByPurchaserEmail(
    email: Order["purchaserEmail"]
  ): Promise<Order[]> {
    const command = new QueryCommand({
      TableName: this.tableName,
      IndexName: "byEmailAndCreatedDate",
      KeyConditionExpression: "purchaserEmail = :purchaserEmail",
      ExpressionAttributeValues: {
        ":purchaserEmail": email,
      },
    });

    const { Items } = await this.docClient.send(command);

    return Items as Order[];
  }

  async updateStatus(id: Order["id"], status: OrderStatus): Promise<void> {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
      UpdateExpression: "SET #status = :status",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":id": id,
      },
      ConditionExpression: "id = :id",
    });

    await this.docClient.send(command);
  }
}
