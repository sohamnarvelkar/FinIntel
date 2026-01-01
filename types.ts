
export enum FinMode {
  TRADING = 'TRADING',
  PORTFOLIO = 'PORTFOLIO',
  ANALYST = 'ANALYST',
  MENTOR = 'MENTOR'
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  mode: FinMode;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
}

export interface PortfolioAsset {
  symbol: string;
  allocation: number; // percentage
  category: string;
}

export interface UserContext {
  mode: FinMode;
  portfolio?: PortfolioAsset[];
}
