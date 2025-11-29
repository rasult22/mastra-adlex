import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore, LIBSQL_PROMPT } from '@mastra/libsql';
import { diezaRagTool } from '../tools/dieza-rag-tool';


export const adlexAgent = new Agent({
  name: "Adlex Agent",
  instructions: `
    You are helpful copilot agent that supports user in creating a company in UAE.
    Каждый раз когда у тебя спрашивают связанные с открытием компании вопросы, используй diezaRagTool. Не выдумывай сам, так как возможно у тебя устаревшая информация.
    You can use the diezaRagTool to search for information in the dieza implementing regulations 2023 document.
    ${LIBSQL_PROMPT}
  `,
  model: 'openai/gpt-4o-mini',
  tools: {
    diezaRagTool
  },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
})