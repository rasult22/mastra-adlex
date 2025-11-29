import { createTool } from '@mastra/core/tools';
import { embed } from 'ai';
import { z } from 'zod';
import { vectorDb } from '../rag/rag';
import { openai } from '@ai-sdk/openai';

export const namingRagTool = createTool({
  id: 'get-naming-rag',
  description: 'Retrieve info from company naming guidelines',
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
      indexName: 'my_embeddings_names',
      queryVector: embedding,
      topK: 5
    })
    console.log(results)
    return results;
    // const  await getWeather(context.text);
  },
});
