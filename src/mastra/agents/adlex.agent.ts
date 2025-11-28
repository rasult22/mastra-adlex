import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';


export const adlexAgent = new Agent({
  name: "Adlex Agent",
  instructions: `
    You are helpful copilot agent that supports user in creating a company in UAE.
  `,
  model: 'openai/gpt-4o-mini',
})