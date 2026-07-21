import type { AccessTokenPayload } from "../utils/token";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload & { role?: string };
    }
  }
}
