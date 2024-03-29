import { toQueryParameters } from "../utils/queryParameters";

const serializeBody = (
  body: string | object | undefined
): string | undefined => {
  switch (typeof body) {
    case "string": {
      return body;
    }
    case "object": {
      return JSON.stringify(body);
    }
    default: {
      return undefined;
    }
  }
};

const APIFetch = async <TResponse>(
  url: string,
  config?: Omit<RequestInit, "body" | "url"> & {
    body?: string | object;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    query?: Record<string, any>;
  }
): Promise<TResponse> => {
  let response: Response;
  let builtURL;

  if (config?.query) {
    builtURL = `${url}?${toQueryParameters(config.query)}`;
  } else {
    builtURL = url;
  }

  try {
    response = await fetch(builtURL, {
      credentials: "include", // Include credentials by default
      ...config,
      headers: {
        // Set content type to json if body is present
        ...(config?.body && { "Content-Type": "application/json" }),
        ...config?.headers, // Overwrite with passed headers
      },
      body: serializeBody(config?.body),
    });
  } catch (error) {
    console.error(error);
    throw new Error("Network Error");
  }

  let data;
  if (
    response.status !== 201 &&
    response.status !== 204 &&
    response.status !== 205
  ) {
    data = await response.json();
  }

  if (response.ok) {
    return data;
  } else {
    throw new Error(data.message);
  }
};

const APIFetchMethodFactory =
  (method: RequestInit["method"]) =>
  <TResponse>(...args: Parameters<typeof APIFetch>) =>
    APIFetch<TResponse>(args[0], { ...args[1], method: method });

APIFetch.get = APIFetchMethodFactory("GET");
APIFetch.post = APIFetchMethodFactory("POST");
APIFetch.put = APIFetchMethodFactory("PUT");
APIFetch.patch = APIFetchMethodFactory("PATCH");
APIFetch.delete = APIFetchMethodFactory("DELETE");

export default APIFetch;
