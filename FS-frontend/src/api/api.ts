export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export type FetchOptions = {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: string;
};

export function buildQueryString(params: QueryParams): string {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== null && value !== "") {
      searchParams.append(key, String(value));
    }
  }

  const qs = searchParams.toString();
  return qs ? `?${qs}` : "";
}

export const API_BASE = "http://localhost:8000";

export async function fetchApi<T>(
  endpoint: string,
  paramsOrOptions?: QueryParams | FetchOptions
): Promise<T> {
  let url = API_BASE + endpoint;
  const options: FetchOptions = {};

  if (paramsOrOptions && "method" in paramsOrOptions) {
    const opts = paramsOrOptions as FetchOptions;
    options.method = opts.method;
    options.body = opts.body;
  } else if (paramsOrOptions) {
    url += buildQueryString(paramsOrOptions as QueryParams);
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers: options.body
      ? { "Content-Type": "application/json" }
      : undefined,
    body: options.body,
  });

  if (!res.ok) {
    throw new Error(`Error ${res.status}: ${res.statusText}`);
  }

  if (res.status === 204) {
    return null as T;
  }

  return res.json();
}