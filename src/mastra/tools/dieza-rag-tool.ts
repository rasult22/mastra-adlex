import { openai } from '@ai-sdk/openai';
import { createTool } from '@mastra/core/tools';
import { embed } from 'ai';
import { z } from 'zod';
import { vectorDb } from '../rag/dieza-tag';

export const diezaRagTool = createTool({
  id: 'dieza-rag',
  description: 'Retrieve info from dieza implementing regs 2023',
  inputSchema: z.object({
    text: z.string().describe('Text to search for in dieza implementing regs 2023'),
  }),
  outputSchema: z.array(z.object({
    id: z.string(),
    score: z.number(),
    metadata: z.record(z.string(), z.any()).optional(),
    vector: z.array(z.number()).optional(),
    document: z.string().optional(),
  })),
  execute: async ({ context }) => {
    // Convert query to embedding
    const { embedding } = await embed({
      value: context.text,
      model: openai.embedding("text-embedding-3-small"),
    });
    const results  = await vectorDb.query({
      indexName: 'my_embeddings',
      queryVector: embedding,
      topK: 5
    })
    console.log(results)
    return results;
    // const  await getWeather(context.text);
  },
});

