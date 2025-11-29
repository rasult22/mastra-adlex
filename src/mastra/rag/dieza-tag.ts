import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { LibSQLVector } from "@mastra/libsql";
import { MDocument } from "@mastra/rag";
// import { z } from "zod";
import fs from "fs";

// 1. Initialize document
const markdownContent = fs.readFileSync(
  new URL("../../../docs/dieza_implementing_regs_2023.md", import.meta.url),
  "utf-8"
);
console.log(markdownContent)

const doc = MDocument.fromMarkdown(markdownContent);

// 2. Create chunks
const chunks = await doc.chunk({
  strategy: "markdown",
  size: 512,
  overlap: 50,
});

// 3. Generate embeddings; we need to pass the text of each chunk
const { embeddings } = await embedMany({
  values: chunks.map((chunk) => chunk.text),
  model: openai.embedding("text-embedding-3-small"),
});

// 4. Store in vector database
const vectorDb = new LibSQLVector({
  connectionUrl: 'file:../mastra.db', // path is relative to the .mastra/output directory
});

await vectorDb.createIndex({
  indexName: "my_embeddings",
  dimension: 1536
})

await vectorDb.upsert({
  indexName: "my_embeddings",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({ text: chunk.text })),
}); // using an index name of 'my_embeddings'

export { vectorDb }