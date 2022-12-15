import React from "react";
import { HTTPError, NetworkError, APISuccess } from "../api/types";
import type {
  User,
  APIResponse,
  AuthenticateResponse,
  StatusResponse,
  CreateUserResponse
} from "../api/types";
import useStorageKey from "./useStorageState";

const API_VERSION = 1;

interface ClientRequestConfig {
  body: any;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
}

type MethodlessConfig = Omit<ClientRequestConfig, "method">;
type BodylessConfig = Omit<MethodlessConfig, "body">;

interface APIState {
  user: User | null;
  refreshToken: string | null;
  accessToken: string | null;
}

interface APIContext extends APIState {
  send: <T>(
    url: string,
    config: Partial<ClientRequestConfig>
  ) => Promise<APIResponse<T>>;
  get: <T>(
    url: string,
    config: Partial<BodylessConfig>
  ) => Promise<APIResponse<T>>;
  post: <T>(
    url: string,
    config: Partial<MethodlessConfig>
  ) => Promise<APIResponse<T>>;
  put: <T>(
    url: string,
    config: Partial<MethodlessConfig>
  ) => Promise<APIResponse<T>>;
  patch: <T>(
    url: string,
    config: Partial<MethodlessConfig>
  ) => Promise<APIResponse<T>>;
  del: <T>(
    url: string,
    config: Partial<BodylessConfig>
  ) => Promise<APIResponse<T>>;
  authenticate: (
    email: string,
    password: string,
    staySignedIn?: boolean
  ) => Promise<APIResponse<AuthenticateResponse>>;
  createUser: (
    username: string,
    email: string,
    password: string
  ) => Promise<APIResponse<CreateUserResponse>>;
  status: () => Promise<APIResponse<StatusResponse>>;
}

const apiContext = React.createContext({} as APIContext);

interface ClientConfig {
  timeout: number;
  baseUrl: string;
  artificialLatency: number;
}
const defaultRequestConfig: ClientRequestConfig = {
  method: "GET",
  body: undefined
};

const defaultClientConfig: ClientConfig = {
  timeout: 5000,
  baseUrl: "/",
  artificialLatency: 0
};

interface APIProviderProps {
  children?: React.ReactNode;
  config?: Partial<ClientConfig>;
}

interface AuthTokens {
  refreshToken: string | null;
  accessToken: string | null;
}

const APIProvider = ({ children, config }: APIProviderProps): JSX.Element => {
  const [apiState, setApiState] = React.useState<APIState>({
    user: null,
    refreshToken: null,
    accessToken: null
  });

  const [_, setAuthData] = useStorageKey<AuthTokens>("auth");

  const providerConfig = { ...defaultClientConfig, ...config };

  if (
    providerConfig.artificialLatency &&
    process.env.NODE_ENV === "production"
  ) {
    console.warn("Articifial latency is set in production");
  }

  const send = async <T,>(
    url: string,
    config?: Partial<ClientRequestConfig>
  ): Promise<APIResponse<T>> => {
    const mergedConfig: ClientRequestConfig = {
      ...defaultRequestConfig,
      ...config
    };

    if (providerConfig.artificialLatency) {
      await new Promise((resolve) =>
        setTimeout(resolve, providerConfig.artificialLatency)
      );
    }

    const aborter = new AbortController();
    const timeout = window.setTimeout(
      () => aborter.abort(),
      providerConfig.timeout
    );

    let response: Response;
    try {
      response = await fetch(
        `${providerConfig.baseUrl}api/v${API_VERSION}${url}`,
        {
          body: mergedConfig.body
            ? JSON.stringify(mergedConfig.body)
            : undefined,
          method: mergedConfig.method,
          headers: { "Content-Type": "application/json" },
          signal: aborter.signal
        }
      );
    } catch (err) {
      console.error(err);
      return new NetworkError(String(err));
    } finally {
      window.clearTimeout(timeout); // Clear abort timer
    }

    const json = await response.json();

    if (!response.ok) return new HTTPError(response.status, json);

    return new APISuccess(json, response);
  };

  const get = <T,>(
    url: string,
    config?: Partial<BodylessConfig>
  ): Promise<APIResponse<T>> => {
    return send(url, { ...config, method: "GET" });
  };

  const post = <T,>(
    url: string,
    config?: Partial<MethodlessConfig>
  ): Promise<APIResponse<T>> => {
    return send(url, { ...config, method: "POST" });
  };

  const put = <T,>(
    url: string,
    config?: Partial<MethodlessConfig>
  ): Promise<APIResponse<T>> => {
    return send(url, { ...config, method: "PUT" });
  };

  const patch = <T,>(
    url: string,
    config?: Partial<MethodlessConfig>
  ): Promise<APIResponse<T>> => {
    return send(url, { ...config, method: "PATCH" });
  };

  const del = <T,>(
    url: string,
    config?: Partial<BodylessConfig>
  ): Promise<APIResponse<T>> => {
    return send(url, { ...config, method: "DELETE" });
  };

  const authenticate = async (
    email: string,
    password: string
    // staySignedIn = true
  ): Promise<APIResponse<AuthenticateResponse>> => {
    const response = await post<AuthenticateResponse>("/auth/authenticate", {
      body: { email, password }
    });

    if (response.ok) {
      setApiState((old) => ({ ...old, user: response.data.user }));
      setAuthData({
        refreshToken: response.data.refreshToken,
        accessToken: null
      });
    }

    return response;
  };

  const createUser = async (
    username: string,
    email: string,
    password: string
  ): Promise<APIResponse<CreateUserResponse>> => {
    const response = await post<CreateUserResponse>("/users", {
      body: { username, email, password }
    });

    return response;
  };

  const status = async (): Promise<APIResponse<StatusResponse>> => {
    const response = await get<StatusResponse>("/status");
    return response;
  };

  return (
    <apiContext.Provider
      value={{
        send,
        get,
        post,
        put,
        patch,
        del,
        authenticate,
        createUser,
        status,
        ...apiState
      }}
    >
      {children}
    </apiContext.Provider>
  );
};

const useAPI = (): APIContext => React.useContext(apiContext);

export { APIProvider, useAPI };
export default useAPI;
