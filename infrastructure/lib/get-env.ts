function getAssertiveEnv<T extends string[]>(...keys: T): Record<T[number], string> {
  for (const key of keys) {
    if (!process.env[key])
      throw new Error("One or more required environment variable was not set.");
  }
  return keys.reduce((prev, curr) => ({ ...prev, [curr]: process.env[curr] }), {}) as Record<
    T[number],
    string
  >;
}

export default getAssertiveEnv;
