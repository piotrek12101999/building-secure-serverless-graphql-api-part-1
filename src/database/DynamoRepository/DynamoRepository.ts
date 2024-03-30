import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  TransactGetCommand,
  UpdateCommand,
} from "@aws-sdk/lib-dynamodb";
import { checkForEnv } from "../../utils/checkForEnv";

export abstract class DynamoRepository<T extends { id: string }> {
  private readonly client = new DynamoDBClient();

  protected readonly docClient = DynamoDBDocumentClient.from(this.client);

  protected readonly tableName: string;

  constructor(tableName: string) {
    this.tableName = checkForEnv(process.env[tableName]);
  }

  async create(entity: T): Promise<void> {
    const command = new PutCommand({
      TableName: this.tableName,
      Item: entity,
    });

    await this.docClient.send(command);
  }

  async findById(id: string): Promise<T> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
    });

    const { Item } = await this.docClient.send(command);

    if (!Item) {
      throw new Error("Not found");
    }

    return Item as T;
  }

  async findAll(): Promise<T[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
    });

    const { Items } = await this.docClient.send(command);

    return (Items || []) as T[];
  }

  private arrayHasEmptyObject(arr: Record<string, unknown>[]) {
    return arr.some((obj) => Object.keys(obj).length === 0);
  }

  async findTransactionalByIds(ids: T["id"][]): Promise<T[]> {
    const command = new TransactGetCommand({
      TransactItems: ids.map((id) => ({
        Get: {
          TableName: this.tableName,
          Key: {
            id,
          },
        },
      })),
    });

    const { Responses } = await this.docClient.send(command);

    if (!Responses) {
      throw new Error("Error while fetching");
    }

    if (this.arrayHasEmptyObject(Responses)) {
      throw new Error("Item not found");
    }

    return Responses.map(({ Item }) => Item as T);
  }

  protected async appendToList(
    id: T["id"],
    entityToBeAppended: unknown,
    propertyName: string
  ) {
    const command = new UpdateCommand({
      TableName: this.tableName,
      Key: {
        id,
      },
      UpdateExpression: `SET ${propertyName} = list_append(${propertyName}, :entity)`,
      ExpressionAttributeValues: {
        ":entity": [entityToBeAppended],
      },
    });

    await this.docClient.send(command);
  }
}
