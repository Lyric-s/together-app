import { AxiosError } from 'axios';

/**
 * Derives a user-facing message from an error and throws a new Error that includes the original error as its `cause`.
 *
 * For AxiosError inputs, the message is taken from common response payload fields when present (for example `response.data.detail` or `response.data.message`); otherwise a generic fallback is used. For non-Axios inputs a generic connection error message is used.
 *
 * @param error - The caught value to analyze; may be an AxiosError with a response payload or any other value.
 * @throws An `Error` whose message is the derived user-facing text and whose `cause` is the original `error`.
 */
export function handleApiError(error: unknown): never {
  if (error instanceof AxiosError) {
    let message = "An unknown error occurred.";
    const responseData = error.response?.data as any; // Cast explicite pour accès souple

    if (responseData) {
      if (typeof responseData.detail === 'string') {
        message = responseData.detail;
      } else if (Array.isArray(responseData.detail)) {
        message = responseData.detail.map((e: any) => e.msg || JSON.stringify(e)).join(', ');
      } else if (typeof responseData.message === 'string') {
        message = responseData.message;
      } else if (typeof responseData === 'string') {
        message = responseData;
      }
    } else if (error.message) {
      message = error.message;
    }

    console.error("API Error (Full):", error);

    throw new Error(message, { cause: error });
  }

  console.error("Non-API Error:", error);
  throw new Error("Unexpected connection error.", { cause: error });
}