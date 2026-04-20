import express from "express";
import OpenAI from "openai";
import { getRelevantDocs } from "../services/ragService.js";
import { getFromCache, saveToCache } from "../services/cacheService.js";
import { trackQuery, trackCacheHit, trackOpenAiCall, trackHumanEscalation } from "../services/metricsService.js";

const router = express.Router();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", async (req, res) => {
    try {
        trackQuery();
        const { message } = req.body;

        const cached = getFromCache(message);

        if (cached) {
            trackCacheHit();
            return res.json({
                answer: cached,
                needs_human: false,
            });
        }

        const docs = await getRelevantDocs(message);

        const context = docs.map(doc => doc.pageContent).join("\n");

        // detección básica de vacío
        if (!context || context.length < 20) {
            trackHumanEscalation();
            return res.json({
                answer: "I don't have enough information to answer that. Let me connect you with a human agent.",
                needs_human: true,
            });
        }

        const prompt = `
ROLE:
You are a customer support assistant for a language academy.

TONE:
- Friendly
- Professional
- Clear and concise

STRICT RULES:
- ONLY answer using the provided context.
- DO NOT use prior knowledge.
- DO NOT make up information.
- If the answer is not explicitly in the context, respond exactly with:
"I don't have enough information to answer that. Let me connect you with a human agent."

CONTEXT:
${context}

EXAMPLES:

User: What are your prices?
Assistant: The English course costs $200 per month and the French course costs $180 per month. The registration fee is $50.

User: What courses do you offer?
Assistant: We offer English, French, and Spanish courses at beginner, intermediate, and advanced levels.

User: Do you teach German?
Assistant: I don't have enough information to answer that. Let me connect you with a human agent.

USER QUESTION:
${message}
`;

        trackOpenAiCall();
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a customer support agent. Answer based on the context." },
                { role: "user", content: prompt }
            ],
            temperature: 0,
        });

        const answer = response.choices[0].message.content;

        // More robust detection of "I don't know"
        const lowerAnswer = answer.toLowerCase();
        const needsHuman = lowerAnswer.includes("don't know") ||
            lowerAnswer.includes("no tengo información") ||
            lowerAnswer.includes("not present in the context");

        if (needsHuman) {
            trackHumanEscalation();
        } else {
            // Save to cache only if we have a valid answer that doesn't need a human
            saveToCache(message, answer);
        }

        res.json({
            answer,
            needs_human: needsHuman,
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Error processing request" });
    }
});

export default router;