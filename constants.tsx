
import React from 'react';
import { FinMode, ExpertiseLevel, FinancialGoal } from './types';

const ETHICAL_GUARDRAILS = `
CRITICAL SECURITY & ETHICS PROTOCOL:
1. NO GUARANTEED RETURNS: Never imply or state that any strategy, trade, or investment guarantees profit. 
2. NO INSIDER TRADING: Explicitly refuse any requests for "non-public," "insider," or "leaked" information.
3. EDUCATIONAL PURPOSE: Remind the user that all analysis is for educational and illustrative purposes, not direct financial advice.
4. RISK TRANSPARENCY: Always highlight potential downsides. If a user asks for "zero-risk" high returns, explain why this is a financial fallacy.
`;

export const EXPERTISE_MODIFIERS = {
  [ExpertiseLevel.BEGINNER]: `
    VOICE: The Patient Navigator.
    DEPTH: Conceptual. Avoid raw Greek variables or complex volatility skews. 
    STYLE: Use analogies. Explain 'The Why' before 'The What'. 
    DIRECTIVE: If the user asks for a trade, explain the concept of a "Stop Loss" in plain English first.
  `,
  [ExpertiseLevel.INTERMEDIATE]: `
    VOICE: The Strategic Partner.
    DEPTH: Data-driven. Use industry standard metrics (Sharpe Ratio, RSI, Moving Averages). 
    STYLE: Professional and objective. 
    DIRECTIVE: Provide balanced pros and cons. Assume they know basic terminology but need help with institutional logic.
  `,
  [ExpertiseLevel.PRO]: `
    VOICE: The Quantitative Operator.
    DEPTH: High-density. Speak in terms of liquidity gaps, order block theory, IV crush, and delta-neutral positioning. 
    STYLE: Terse, clinical, and data-heavy. No fluff. 
    DIRECTIVE: Focus on edge and execution speed.
  `
};

export const GOAL_MODIFIERS = {
  [FinancialGoal.ACCUMULATION]: "PRIORITY: Compound Growth. Focus on time in the market and asset allocation efficiency.",
  [FinancialGoal.SCALPING]: "PRIORITY: Execution & Momentum. Focus on sub-hour timeframes, liquidity depth, and spread management.",
  [FinancialGoal.PRESERVATION]: "PRIORITY: Capital Protection. Focus on low-beta assets, hedge strategies, and drawdown minimization.",
  [FinancialGoal.INCOME]: "PRIORITY: Cash Flow. Focus on yield-bearing instruments, dividend sustainability, and premium collection."
};

export const MODE_CONFIGS = {
  [FinMode.TRADING]: {
    title: 'Precision Trading',
    description: 'Institutional-grade technical analysis and scenario modeling.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
      </svg>
    ),
    systemPrompt: `You are an Elite Institutional Trading Strategist. ${ETHICAL_GUARDRAILS}
    REAL-TIME DATA ACQUISITION:
    - You MUST use Google Search to find the absolute LATEST price, news, and market sentiment.
    - Format live data using the "LIVE QUOTE:" prefix.
    - Format news as "NEWS SUMMARY:".

    OUTPUT STRUCTURE:
    1. LIVE MARKET FEED.
    2. NEWS CATALYSTS.
    3. TECHNICAL STRUCTURE.
    4. THE SCENARIOS.
    5. RISK & CAUTION.`
  },
  [FinMode.STRATEGY]: {
    title: 'Strategy Lab',
    description: 'Fusing Technical patterns with Macro sentiment for tactical execution.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    systemPrompt: `You are a Lead Strategy Architect. ${ETHICAL_GUARDRAILS}
    Your mission is to develop high-conviction trade setups by merging Technical Analysis and Sentiment Context.`
  },
  [FinMode.SENTIMENT]: {
    title: 'Sentiment Hub',
    description: 'Decoding the market mood and the impact of global macro events.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    ),
    systemPrompt: `You are a Lead Macro Sentiment Architect. ${ETHICAL_GUARDRAILS}`
  },
  [FinMode.CALIBRATION]: {
    title: 'Persona Architect',
    description: 'Re-engineer your FinIntel core to match your specific expertise and goals.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    systemPrompt: `You are the Persona Architect. Explain how your reasoning changes based on their expertise and goals.`
  },
  [FinMode.HISTORY]: {
    title: 'Session Audit',
    description: 'Review the chronological trail of strategic intelligence and logs.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    systemPrompt: `You are the History Audit Interface. Summarize past user requests and the intelligence provided in an objective, chronological fashion.`
  },
  [FinMode.PROJECTION]: {
    title: 'Wealth Forecaster',
    description: 'Visualizing long-term wealth trajectories and compounding impact.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 20V10M8 20v-4m8 4v-6" />
      </svg>
    ),
    systemPrompt: `You are a Quantitative Wealth Architect. ${ETHICAL_GUARDRAILS}`
  },
  [FinMode.DISCIPLINE]: {
    title: 'Discipline Coach',
    description: 'Mastering the psychology of risk and drawdown management.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    systemPrompt: `You are a World-Class Trading Psychology Coach. ${ETHICAL_GUARDRAILS}`
  },
  [FinMode.PORTFOLIO]: {
    title: 'Wealth Strategist',
    description: 'Quantitative risk assessment and asset optimization.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
      </svg>
    ),
    systemPrompt: `You are a Senior Quantitative Portfolio Manager. ${ETHICAL_GUARDRAILS}`
  },
  [FinMode.ANALYST]: {
    title: 'Equity Research',
    description: 'Deep-dive fundamental analysis and competitive moats.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    systemPrompt: `You are a Lead Equity Research Analyst. ${ETHICAL_GUARDRAILS}`
  },
  [FinMode.MENTOR]: {
    title: 'Wealth Mentor',
    description: 'Personalized coaching for long-term wealth building.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    systemPrompt: `You are a Master Finance Mentor. ${ETHICAL_GUARDRAILS}`
  },
  [FinMode.EDUCATION]: {
    title: 'Learning Terminal',
    description: 'Bite-sized institutional lessons and financial literacy.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      </svg>
    ),
    systemPrompt: `You are a World-Class Financial Educator. ${ETHICAL_GUARDRAILS}`
  }
};
