const cache = new Map();

export const getFromCache = (question) => {
    return cache.get(question.toLowerCase());
};

export const saveToCache = (question, answer) => {
    cache.set(question.toLowerCase(), answer);
};