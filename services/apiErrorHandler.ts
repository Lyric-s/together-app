import { AxiosError } from 'axios';

/**
 * Derives a user-facing message from a caught error and throws an Error with that message.
 *
 * For AxiosError inputs, prefers `response.data.detail` (string or array), then `response.data.message`,
 * then `response.data` as a string, then `error.message`, and finally the fallback
 * `"An unknown error occurred."`. For non-Axios inputs, uses the message
 * `"Unexpected connection error."`. The original error is attached as `cause` and the input is logged to the console.
 *
 * @param error - The caught value to analyze; may be an AxiosError with a response payload or any other value.
 * @throws An `Error` with the derived user-facing message. The thrown error's `cause` is the original input.
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