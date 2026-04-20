import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "@langchain/classic/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "@langchain/classic/text_splitter";
import fs from "fs";
import path from "path";

let vectorStore;

export const initializeVectorStore = async () => {
    const folderPath = path.join(process.cwd(), "data");
    const files = fs.readdirSync(folderPath);

    const docs = [];

    for (const file of files) {
        const content = fs.readFileSync(path.join(folderPath, file), "utf-8");

        docs.push({
            pageContent: content,
            metadata: { source: file },
        });
    }

    const splitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 50,
    });

    const splitDocs = await splitter.splitDocuments(docs);

    const embeddings = new OpenAIEmbeddings({
        apiKey: process.env.OPENAI_API_KEY,
    });

    vectorStore = await MemoryVectorStore.fromDocuments(
        splitDocs,
        embeddings
    );

    console.log("Vector store initialized");
};

export const getRelevantDocs = async (query) => {
    return await vectorStore.similaritySearch(query, 3);
};