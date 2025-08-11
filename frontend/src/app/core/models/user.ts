export interface User {
  success: boolean;
  data: {
    email: string;
    sessionId: string;
    loginMethod: string;
  };
  timestamp: string;
}
