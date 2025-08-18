export interface ConnectionResponse {
  success: boolean;
  data: Data;
  timestamp: string;
}

export interface Data {
  connections: Connection[];
}

export interface Connection {
  name: string;
  type: string;
  description: string;
  isAvailable: boolean;
  authUrl?: string;
  details: Details;
  setupUrl?: string;
}

export interface Details {
  url?: string;
  lastAuthorized: any;
  tokenExpiry: any;
  hasRefreshToken?: boolean;
  lastConfigured?: string;
  method?: string;
  hasCredentials?: boolean;
  hasGitToken?: boolean;
  credentialSources?: string[];
  checkedPaths?: string[];
  available?: boolean;
}
