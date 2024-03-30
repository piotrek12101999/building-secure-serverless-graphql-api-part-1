export const checkForEnv = (variable: string | undefined) => {
  if (!variable) {
    throw new Error("Missing env variable");
  }

  return variable;
};
