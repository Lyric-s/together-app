/**
 * Authentication data models.
 * Defines the structure of authentication tokens and payloads used
 * for login and token refresh operations.
 */

export interface Token {
  access_token: string;
  refresh_token?: string;
  token_type: "bearer";
}

export interface TokenData {
  username?: string;
}

export interface TokenRefreshRequest {
  refresh_token: string;
}
