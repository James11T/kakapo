const assertEnv = <T extends string[]>(...keys: T) => {
  for (const key of keys) {
    if (!process.env[key])
      throw new Error("One or more required environment variable was not set.");
  }
};

const getAssertiveEnv = <T extends string[]>(
  ...keys: T
): Record<T[number], string> => {
  assertEnv(...keys);
  const keyObject: Record<string, any> = {};

  for (const key of keys) {
    keyObject[key] = process.env[key];
  }

  return keyObject;
};

export { assertEnv, getAssertiveEnv };
