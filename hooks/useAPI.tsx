import React from "react";
import API from "../api/api";
import type {
  User,
  APIResponse,
  AuthenticateResponse,
  StatusResponse,
  CreateUserResponse,
  BaseConfig
} from "../api/types";
import useStorageKey from "./useStorageState";

interface APIState {
  user: User | null;
  refreshToken: string | null;
  accessToken: string | null;
}

interface APIContext extends APIState {
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

interface APIProviderProps {
  children?: React.ReactNode;
  config?: Partial<BaseConfig>;
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

  const hookAPI = new API(config);
  const [_, setAuthData] = useStorageKey<AuthTokens>("auth");

  if (
    hookAPI.config.artificialLatency &&
    process.env.NODE_ENV === "production"
  ) {
    console.warn("Artificial latency is set in production");
  }

  const authenticate = async (
    email: string,
    password: string
    // staySignedIn = true
  ): Promise<APIResponse<AuthenticateResponse>> => {
    const response = await hookAPI.authenticate(email, password);

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
    const response = await hookAPI.createUser(username, email, password);
    return response;
  };

  const status = async (): Promise<APIResponse<StatusResponse>> => {
    const response = await hookAPI.status();
    return response;
  };

  return (
    <apiContext.Provider
      value={{
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
