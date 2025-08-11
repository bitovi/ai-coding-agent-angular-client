export interface PromptResponse {
  prompts: Prompt[];
}

export interface Prompt {
  name: string;
  messages: Message[];
  canRun: boolean;
  connections: Connection[];
}

export interface Message {
  role: string;
  content: string;
  parameters?: Parameters;
}

export interface Parameters {
  type: string;
  properties: Properties;
  required: string[];
}

export interface Properties {
  commitMessage?: CommitMessage;
  projectKey?: ProjectKey;
  timeframe?: Timeframe;
  greeting?: Greeting;
  summary?: Summary;
  description?: Description;
  issueType?: IssueType;
  repository?: Repository;
  filePath?: FilePath;
}

export interface CommitMessage {
  type: string;
  description: string;
}

export interface ProjectKey {
  type: string;
  description: string;
}

export interface Timeframe {
  type: string;
  description: string;
  default: number;
}

export interface Greeting {
  type: string;
  description: string;
}

export interface Summary {
  type: string;
  description: string;
}

export interface Description {
  type: string;
  description: string;
}

export interface IssueType {
  type: string;
  description: string;
  default: string;
}

export interface Repository {
  type: string;
  description: string;
}

export interface FilePath {
  type: string;
  description: string;
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
}
