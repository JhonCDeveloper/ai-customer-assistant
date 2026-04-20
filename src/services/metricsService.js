let metrics = {
    totalQueries: 0,
    humanEscalations: 0,
    cacheHits: 0,
    openAiCalls: 0,
};

export const trackQuery = () => {
    metrics.totalQueries += 1;
};

export const trackHumanEscalation = () => {
    metrics.humanEscalations += 1;
};

export const trackCacheHit = () => {
    metrics.cacheHits += 1;
};

export const trackOpenAiCall = () => {
    metrics.openAiCalls += 1;
};

export const getMetrics = () => {
    return metrics;
};