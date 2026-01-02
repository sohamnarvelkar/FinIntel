
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
  SENTIMENT = 'SENTIMENT',
  HISTORY = 'HISTORY'
}

export enum ExpertiseLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  PRO = 'PRO'
}

export enum FinancialGoal {
  ACCUMULATION = 'ACCUMULATION', // Wealth building
  SCALPING = 'SCALPING',       // High frequency / Short term
  PRESERVATION = 'PRESERVATION', // Defensive / Wealth protection
  INCOME = 'INCOME'              // Yield / Dividend focus
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
  goal: FinancialGoal;
  portfolio?: PortfolioAsset[];
}
