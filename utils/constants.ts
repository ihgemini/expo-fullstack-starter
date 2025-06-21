/**
 * Application Constants
 *
 * This file centralizes all constants used across the application.
 * Import from this file instead of defining constants in individual files.
 */

import { getBaseUrl } from "@/lib/shared";

// Authentication Constants
export const COOKIE_NAME = "auth_token";
export const REFRESH_COOKIE_NAME = "refresh_token";
export const COOKIE_MAX_AGE = 24 * 60 * 60; // 24 hours
export const JWT_EXPIRATION_TIME = "24h"; // 24 hours
export const REFRESH_TOKEN_EXPIRY = "90d"; // 90 days (longer for offline)
export const REFRESH_TOKEN_MAX_AGE = 90 * 24 * 60 * 60; // 90 days in seconds

// Refresh Token Constants
export const REFRESH_BEFORE_EXPIRY_SEC = 24 * 60 * 60; // Refresh 24 hours before expiry

// Google OAuth Constants
export const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
export const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;
export const GOOGLE_REDIRECT_URI = `${getBaseUrl()}/api/auth/callback`;
export const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";

// Environment Constants
export const BASE_URL = getBaseUrl();
export const APP_SCHEME = process.env.EXPO_PUBLIC_SCHEME;
export const JWT_SECRET = process.env.JWT_SECRET!;

// Cookie Settings
export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax" as const,
  path: "/",
  maxAge: COOKIE_MAX_AGE,
};

export const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: true,
  sameSite: "Lax" as const,
  path: "/api/auth/refresh", // Restrict to refresh endpoint only
  maxAge: REFRESH_TOKEN_MAX_AGE,
};
