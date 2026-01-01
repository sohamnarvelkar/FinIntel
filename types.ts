
export enum FinMode {
  TRADING = 'TRADING',
  PORTFOLIO = 'PORTFOLIO',
  ANALYST = 'ANALYST',
  MENTOR = 'MENTOR',
  EDUCATION = 'EDUCATION',
  STRATEGY = 'STRATEGY',
  DISCIPLINE = 'DISCIPLINE',
  PROJECTION = 'PROJECTION',
  CALIBRATION = 'CALIBRATION',
  SENTIMENT = 'SENTIMENT'
}

export enum ExpertiseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  PRO = 'PRO'
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
  expertise: ExpertiseLevel;
  portfolio?: PortfolioAsset[];
}
