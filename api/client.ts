import { APIError, HTTPError, NetworkError } from "./apiTypes";
import { Err, Ok } from "ts-results";
import type {
  AuthenticateResponse,
  APIResponse,
  AuthenticatedUser
} from "./apiTypes";
import type { Result } from "ts-results";

const API_VERSION = 1;

interface ClientRequestConfig {
  body: any;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

const DEFAULT_CONFIG: ClientRequestConfig = {
  method: "GET",
  body: undefined
};

class Client {
  private baseUrl: string;
  private user: AuthenticatedUser | null = null;
  private accessToken: string | null = null;

  constructor(baseUrl = "/") {
    this.baseUrl = baseUrl;
  }

  public async send<T>(
    url: string,
    config: Partial<ClientRequestConfig>
  ): Promise<Result<APIResponse<T>, APIError>> {
    const mergedConfig: ClientRequestConfig = { ...DEFAULT_CONFIG, ...config };

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}api/v${API_VERSION}${url}`, {
        body: mergedConfig.body ? JSON.stringify(mergedConfig.body) : undefined,
        method: mergedConfig.method,
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error(err);
      return Err(new NetworkError());
    }

    const json = await response.json();

    if (!response.ok) return Err(new HTTPError(response.status, json));

    return Ok({ data: json, response });
  }

  public async authenticate(
    email: string,
    password: string
  ): Promise<Result<APIResponse<AuthenticateResponse>, APIError>> {
    return this.send<AuthenticateResponse>("/auth/authenticate", {
      body: { email, password },
      method: "POST"
    });
  }
}

export default Client;
