import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: ["src/api/schema.graphql", "src/api/aws.graphql"],
  generates: {
    "src/generated/graphql.ts": {
      plugins: ["typescript"],
      config: {
        scalars: {
          AWSEmail: "string",
          AWSTimestamp: "string",
        },
      },
    },
  },
};

export default config;
