import type { ErrorResult, SuccessResult } from "../types";

const Ok = <T>(val: T): SuccessResult<T> => ({ val, ok: true, err: false });
const Err = <T extends string>(val: T): ErrorResult<T> => ({ val, ok: false, err: true });

export { Ok, Err };
