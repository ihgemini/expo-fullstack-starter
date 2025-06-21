import { COOKIE_NAME, JWT_SECRET } from "@/utils/constants";
import { getAuthenticatedUser } from "@/utils/auth";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  picture?: string;
  given_name?: string;
  family_name?: string;
  email_verified?: boolean;
  provider?: string;
  exp?: number;
  cookieExpiration?: number; // Added for web cookie expiration tracking
};

/**
 * Middleware to authenticate API requests using JWT from Authorization header or cookies
 * @param handler The API route handler to be protected
 *
 * Note for devs: Technically, it's not a middleware in the traditional sense. This function acts as a higher-order function that adds authentication to API route handlers.
 */
export function withAuth<T extends Response>(
  handler: (req: Request, user: AuthUser) => Promise<T>
) {
  return async (req: Request): Promise<T | Response> => {
    const user = await getAuthenticatedUser(req.headers);

    if (!user) {
      return Response.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    return await handler(req, user);
  };
}
