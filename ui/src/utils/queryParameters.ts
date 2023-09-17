type HyphenateCharacter<TValue extends string> =
  TValue extends Uppercase<TValue> ? Lowercase<`-${TValue}`> : TValue;

type KebabCase<TValue extends string> =
  TValue extends `${infer TChar}${infer TRest}`
    ? `${HyphenateCharacter<TChar>}${TRest extends "" ? "" : KebabCase<TRest>}`
    : "";

type KebabCaseKeys<TObject> = {
  [TKey in keyof TObject as KebabCase<string & TKey>]: TObject[TKey];
};

const toKebabCase = <TValue extends string>(value: TValue): KebabCase<TValue> =>
  value.replace(
    /[A-Z]/g,
    (match) => "-" + match.toLowerCase()
  ) as KebabCase<TValue>;

const kebabCaseKeys = <TValues extends object>(values: TValues) => {
  const newObject: Record<string, unknown> = {};

  for (const entry of Object.entries(values)) {
    const [key, value] = entry;
    newObject[toKebabCase(key)] = value;
  }

  return newObject as KebabCaseKeys<TValues>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const toQueryParameters = (values: Record<string, any>) => {
  const stringValues = Object.entries(values).reduce<Record<string, string>>(
    (prev, [key, value]) => {
      prev[key] = String(value);
      return prev;
    },
    {}
  );

  const queryParameters = new URLSearchParams(
    kebabCaseKeys(stringValues)
  ).toString();

  return queryParameters;
};

export { toQueryParameters, kebabCaseKeys };
