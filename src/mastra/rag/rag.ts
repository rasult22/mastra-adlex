import { embedMany } from "ai";
import { openai } from "@ai-sdk/openai";
import { LibSQLVector } from "@mastra/libsql";
import { MDocument } from "@mastra/rag";
// import { z } from "zod";
import fs from "fs";

// 1. Initialize document
const dieza_markdownContent = fs.readFileSync(
  new URL("./../../docs/dieza_implementing_regs_2023.md", import.meta.url),
  "utf-8"
);
const names_markdownContent = fs.readFileSync(
  new URL("./../../docs/company_guidelines.md", import.meta.url),
  "utf-8"
);
const docDieza = MDocument.fromMarkdown(dieza_markdownContent);
const docNames = MDocument.fromMarkdown(names_markdownContent);

// 2. Create chunks
const chunksDieza = await docDieza.chunk({
  strategy: "markdown",
  size: 512,
  overlap: 50,
});
const chunksNames = await docNames.chunk({
  strategy: "markdown",
  size: 512,
  overlap: 50,
});

// 3. Generate embeddings; we need to pass the text of each chunk
const { embeddings: diezaEmbeddings } = await embedMany({
  values: chunksDieza.map((chunk) => chunk.text),
  model: openai.embedding("text-embedding-3-small"),
});
const { embeddings: namesEmbeddings } = await embedMany({
  values: chunksNames.map((chunk) => chunk.text),
  model: openai.embedding("text-embedding-3-small"),
});

// 4. Store in vector database
const vectorDb = new LibSQLVector({
  connectionUrl: 'file:../mastra.db', // path is relative to the .mastra/output directory
});

await vectorDb.createIndex({
  indexName: "my_embeddings_dieza",
  dimension: 1536
})

await vectorDb.createIndex({
  indexName: "my_embeddings_names",
  dimension: 1536
})

await vectorDb.upsert({
  indexName: "my_embeddings_dieza",
  vectors: diezaEmbeddings,
  metadata: chunksDieza.map((chunk) => ({ text: chunk.text })),
}); 
await vectorDb.upsert({
  indexName: "my_embeddings_names",
  vectors: namesEmbeddings,
  metadata: chunksNames.map((chunk) => ({ text: chunk.text })),
}); // using an index name of 'my_embeddings'

export { vectorDb }