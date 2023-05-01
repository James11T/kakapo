import type { ZodObject, z } from "zod";

interface JWTAccessToken {
  refresh_jti: string;
  sub: string; // Subject
  exp: number; // Expires at
  iat: number; // Issued at
}

interface JWTRefreshToken {
  jti: string; // Unique token ID
  sub: string; // Subject
  exp: number; // Expires at
  iat: number; // Issued at
  scp: string; // Scope
}

type FriendshipStatus = "NOT_FRIENDS" | "PENDING" | "FRIENDS";

type RequireKey<T, U = { [K in keyof T]: Pick<T, K> }> = Partial<T> &
  { [K in keyof U]: Required<Pick<U[K], keyof U[K]>> }[keyof U];

type ValidationSchema = ZodObject<{
  params?: any;
  body?: any;
  query?: any;
}>;

interface BaseResult<S, E> {
  readonly ok: boolean;
  readonly err: boolean;

  readonly val: S | E;
}

interface SuccessResult<T> extends BaseResult<T, never> {
  readonly ok: true;
  readonly err: false;

  val: T;
}

interface ErrorResult<T> extends BaseResult<never, T> {
  readonly ok: false;
  readonly err: true;
  val: T;
}

type Result<S, E> = SuccessResult<S> | ErrorResult<E>;
type AsyncResult<S, E> = Promise<Result<S, E>>;

export type {
  JWTAccessToken,
  JWTRefreshToken,
  FriendshipStatus,
  RequireKey,
  ValidationSchema,
  AsyncResult,
  SuccessResult,
  ErrorResult,
  Result,
};
