import "dotenv/config";
import express from "express";
import cors from "cors";
import chatRoutes from "./routes/chat.js";
import metricsRoutes from "./routes/metrics.js";
import { initializeVectorStore } from "./services/ragService.js";

await initializeVectorStore();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/chat", chatRoutes);
app.use("/metrics", metricsRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});