import * as jose from "jose";
import { COOKIE_NAME, JWT_SECRET } from "@/utils/constants";
import { AuthUser } from "@/utils/middleware";

export async function getAuthenticatedUser(
  headers: Headers
): Promise<AuthUser | null> {
  try {
    let token: string | null = null;

    // Try Authorization header first (native apps)
    const authHeader = headers.get("authorization");
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Try cookies (web)
    if (!token) {
      const cookieHeader = headers.get("cookie");
      if (cookieHeader) {
        const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
          const [key, value] = cookie.trim().split("=");
          acc[key.trim()] = decodeURIComponent(value);
          return acc;
        }, {} as Record<string, string>);

        let cookieValue = cookies[COOKIE_NAME];

        // Handle array format if present
        if (cookieValue) {
          try {
            const parsed = JSON.parse(cookieValue);
            if (Array.isArray(parsed) && parsed[0]) {
              token = parsed[0];
            } else {
              token = cookieValue;
            }
          } catch {
            token = cookieValue;
          }
        }
      }
    }

    // Verify token if found
    if (token && JWT_SECRET) {
      const decoded = await jose.jwtVerify(
        token,
        new TextEncoder().encode(JWT_SECRET)
      );
      return decoded.payload as AuthUser;
    }

    return null;
  } catch (error) {
    console.error("Auth error:", error);
    return null;
  }
}
