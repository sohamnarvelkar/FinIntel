
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

export interface Attachment {
  data: string; // base64
  mimeType: string;
  name: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  mode: FinMode;
  timestamp: number;
  sources?: Array<{ title: string; uri: string }>;
  attachments?: Attachment[];
}

export enum ErrorCategory {
  API = 'API_FAULT',
  NETWORK = 'NETWORK_OFFLINE',
  SAFETY = 'CONTENT_BLOCKED',
  PERMISSIONS = 'PERMISSION_DENIED',
  VALIDATION = 'INPUT_VALIDATION',
  AUTH = 'AUTHENTICATION_ERROR'
}

export interface AppError {
  category: ErrorCategory;
  message: string;
  retryable: boolean;
  timestamp: number;
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

export interface UserSession {
  username: string;
  lastLogin: number;
  accessLevel: 'STANDARD' | 'INSTITUTIONAL';
}

export type AuthStatus = 'UNAUTHENTICATED' | 'CHALLENGE' | 'KEY_REQUIRED' | 'AUTHENTICATED';
