/**
 * Utility functions to make API requests.
 * By importing this file, you can use the provided get and post functions.
 * You shouldn't need to modify this file, but if you want to learn more
 * about how these functions work, google search "Fetch API"
 *
 * These functions return promises, which means you should use ".then" on them.
 * e.g. get('/api/foo', { bar: 0 }).then(res => console.log(res))
 */

// Define types for query parameters and primitives
type Primitive = string | number | boolean;
type QueryParams = Record<string, Primitive>;

/**
 * Formats an object of parameters into a URL-encoded query string.
 * @param params - An object with primitive values to be encoded.
 * @returns A string in the format "key1=value1&key2=value2".
 * @example formatParams({ some_key: "some_value", a: "b" }) => "some_key=some_value&a=b"
 */
function formatParams(params: QueryParams): string {
  return Object.keys(params)
    .map((key) => `${key}=${encodeURIComponent(params[key].toString())}`)
    .join("&");
}

/**
 * Converts a fetch Response to a JSON object with error handling.
 * @param res - The Response object from a fetch request.
 * @returns A Promise resolving to the JSON data of type T.
 * @throws {Error} If the response is not OK or cannot be parsed as JSON.
 */
function convertToJSON<T>(res: Response): Promise<T> {
  if (!res.ok) {
    throw new Error(`API request failed with response status ${res.status} and text: ${res.statusText}`);
  }

  return res
    .clone() // Clone to preserve the original response for debugging
    .json()
    // .catch((error: any) => {
    //   return res.text().then((text: string) => {
    //     throw new Error(`API request's result could not be converted to a JSON object: \n${text} \n Error: ${error}`);
    //   });
    // });
}

/**
 * Makes a GET request to the specified endpoint with optional parameters.
 * @param endpoint - The API endpoint URL.
 * @param params - Query parameters (default: empty object).
 * @returns A Promise resolving to the JSON response of type T.
 * @example get<string[]>('/api/foo', { bar: 0 }).then(res => console.log(res))
 */
export function get<T>(endpoint: string, params: QueryParams = {}): Promise<T> {
  const fullPath = endpoint + "?" + formatParams(params);
  return fetch(fullPath)
    .then((res) => convertToJSON<T>(res))
    // .catch((error: any) => {
    //   throw new Error(`GET request to ${fullPath} failed with error:\n${error}`);
    // });
}

/**
 * Makes a POST request to the specified endpoint with a JSON body.
 * @param endpoint - The API endpoint URL.
 * @param params - Data to send in the request body (default: empty object).
 * @returns A Promise resolving to the JSON response of type T.
 * @example post<{ id: number }>('/api/create', { name: "test" }).then(res => console.log(res))
 */
export function post<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
  return fetch(endpoint, {
    method: "post",
    headers: { "Content-type": "application/json" },
    body: JSON.stringify(params),
  })
    .then((res) => convertToJSON<T>(res))
    // .catch((error: any) => {
    //   throw new Error(`POST request to ${endpoint} failed with error:\n${error}`);
    // });
}