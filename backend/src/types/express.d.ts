declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        firebaseUid: string;
        email: string;
        username: string;
        role: string;
      };
    }
  }
}
export {};
