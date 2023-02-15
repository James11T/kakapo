import { HTTPError, NetworkError, APISuccess } from "./types";
import type {
  APIResponse,
  MethodlessConfig,
  BodylessConfig,
  RequestConfig,
  BaseConfig,
  AuthenticateResponse,
  StatusResponse,
  CreateUserResponse,
  User
} from "./types";

const defaultConfig: BaseConfig = {
  timeout: 5000,
  baseUrl: "/",
  artificialLatency: 0
};

const defaultRequestConfig: RequestConfig = {
  ...defaultConfig,
  body: undefined,
  method: "GET"
};

class API {
  public readonly config: BaseConfig;
  private readonly API_VERSION = 1;

  constructor(config: Partial<BaseConfig> = {}) {
    this.config = { ...defaultConfig, ...config };

    if (
      this.config.artificialLatency !== 0 &&
      process.env.NODE_ENV === "production"
    ) {
      console.warn("Artificial latency set in production");
    }
  }

  async send<T>(
    endpoint: string,
    config?: Partial<RequestConfig>
  ): Promise<APIResponse<T>> {
    const mergedConfig: RequestConfig = {
      ...defaultRequestConfig,
      ...this.config,
      ...config
    };

    if (mergedConfig.artificialLatency) {
      await new Promise((resolve) =>
        setTimeout(resolve, mergedConfig.artificialLatency)
      );
    }

    const aborter = new AbortController();
    const timeout = setTimeout(() => aborter.abort(), mergedConfig.timeout);

    let response: Response;
    try {
      const joinedUrl = `${mergedConfig.baseUrl}api/v${this.API_VERSION}${endpoint}`;
      response = await fetch(joinedUrl, {
        body: mergedConfig.body ? JSON.stringify(mergedConfig.body) : undefined,
        method: mergedConfig.method,
        headers: { "Content-Type": "application/json" },
        signal: aborter.signal
      });
    } catch (err) {
      console.error(err);
      return new NetworkError(String(err));
    } finally {
      clearTimeout(timeout); // Clear abort timer
    }

    const json = await response.json();

    if (!response.ok) return new HTTPError(response.status, json);

    return new APISuccess(json, response);
  }

  async get<T>(
    url: string,
    config?: Partial<BodylessConfig>
  ): Promise<APIResponse<T>> {
    return await this.send(url, { ...config, method: "GET" });
  }

  async post<T>(
    url: string,
    config?: Partial<MethodlessConfig>
  ): Promise<APIResponse<T>> {
    return await this.send(url, { ...config, method: "POST" });
  }

  async put<T>(
    url: string,
    config?: Partial<MethodlessConfig>
  ): Promise<APIResponse<T>> {
    return await this.send(url, { ...config, method: "PUT" });
  }

  async patch<T>(
    url: string,
    config?: Partial<MethodlessConfig>
  ): Promise<APIResponse<T>> {
    return await this.send(url, { ...config, method: "PATCH" });
  }

  async del<T>(
    url: string,
    config?: Partial<BodylessConfig>
  ): Promise<APIResponse<T>> {
    return await this.send(url, { ...config, method: "DELETE" });
  }

  async authenticate(
    email: string,
    password: string
  ): Promise<APIResponse<AuthenticateResponse>> {
    const response = await this.post<AuthenticateResponse>(
      "/auth/authenticate",
      {
        body: { email, password }
      }
    );
    return response;
  }

  async createUser(
    username: string,
    email: string,
    password: string
  ): Promise<APIResponse<CreateUserResponse>> {
    const response = await this.post<CreateUserResponse>("/users", {
      body: { username, email, password }
    });

    return response;
  }

  async status(): Promise<APIResponse<StatusResponse>> {
    const response = await this.get<StatusResponse>("/status");
    return response;
  }

  async getUser(username: string): Promise<APIResponse<User>> {
    const response = await this.get<User>(`/users/${username}`);

    return response;
  }
}

const serverAPI = new API({
  timeout: 5000,
  baseUrl: "http://localhost:5000/"
});

export default API;
export { serverAPI };
