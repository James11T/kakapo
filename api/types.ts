import status from "http-status";

interface AuthenticateResponse {
  refreshToken: string;
  user: AuthenticatedUser;
}

interface User {
  id: string;
  email: string;
  username: string;
}

interface AuthenticatedUser extends User {
  refreshToken: string;
}

class APISuccess<T> {
  readonly data: T;
  readonly response: Response;
  readonly ok = true;
  readonly err = false;

  constructor(data: T, response: Response) {
    this.data = data;
    this.response = response;
  }
}

class NetworkError {
  public readonly details: string;
  public readonly network = true;
  public readonly http = false;
  public readonly ok = false;
  public readonly err = true;

  constructor(details: string) {
    this.details = details;
  }

  public text(): string {
    return "Unexpected network error";
  }
}

type HTTPErrorDetails = { error: string; [key: string]: any } | null;

class HTTPError {
  public readonly code: number;
  public readonly details: HTTPErrorDetails | null = null;
  public readonly network = false;
  public readonly http = true;
  public readonly ok = false;
  public readonly err = true;

  constructor(code: number, details: HTTPErrorDetails | null = null) {
    this.code = code;
    this.details = details;
  }

  public text(): string {
    return `HTTP ${this.code}: ${status[this.code]}`;
  }
}

type APIResponse<T> = APISuccess<T> | HTTPError | NetworkError;

export { NetworkError, HTTPError, APISuccess };
export type { AuthenticateResponse, User, AuthenticatedUser, APIResponse };
