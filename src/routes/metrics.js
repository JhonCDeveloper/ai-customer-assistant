import express from "express";
import { getMetrics } from "../services/metricsService.js";

const router = express.Router();

router.get("/", (req, res) => {
    res.json(getMetrics());
});

export default router;