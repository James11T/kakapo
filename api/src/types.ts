import type { ZodObject } from "zod";

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

export type { JWTAccessToken, JWTRefreshToken, FriendshipStatus, RequireKey, ValidationSchema };
