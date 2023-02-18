const assertEnv = <T extends string[]>(...keys: T) => {
  for (const key of keys) {
    if (!process.env[key])
      throw new Error("One or more required environment variable was not set.");
  }
};

const getAssertiveEnv = <T extends string[]>(...keys: T): Record<T[number], string> => {
  assertEnv(...keys);
  return keys.reduce((prev, curr) => ({ ...prev, [curr]: process.env[curr] }), {}) as Record<
    T[number],
    string
  >;
};

export { assertEnv, getAssertiveEnv };
