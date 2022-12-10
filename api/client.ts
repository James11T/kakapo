import { HTTPError, NetworkError } from "./apiTypes";
import { Err, Ok } from "ts-results";
import type {
  AuthenticateResponse,
  APIResponse,
  AuthenticatedUser
} from "./apiTypes";
import type { Result } from "ts-results";
import type { APIError } from "./apiTypes";

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
  private timeout = 5000;

  constructor(baseUrl = "/") {
    this.baseUrl = baseUrl;
  }

  public async send<T>(
    url: string,
    config: Partial<ClientRequestConfig>
  ): Promise<Result<APIResponse<T>, APIError>> {
    const mergedConfig: ClientRequestConfig = { ...DEFAULT_CONFIG, ...config };

    const aborter = new AbortController();
    const timeout = window.setTimeout(() => aborter.abort(), this.timeout);

    let response: Response;
    try {
      response = await fetch(`${this.baseUrl}api/v${API_VERSION}${url}`, {
        body: mergedConfig.body ? JSON.stringify(mergedConfig.body) : undefined,
        method: mergedConfig.method,
        headers: { "Content-Type": "application/json" },
        signal: aborter.signal
      });
    } catch (err) {
      console.error(err);
      return Err(new NetworkError());
    } finally {
      window.clearTimeout(timeout); // Clear abort timer
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
