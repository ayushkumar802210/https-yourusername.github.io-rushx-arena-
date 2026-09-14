(function () {
  function clampText(value, maxLen) {
    const text = String(value || '').trim();
    if (!text) return '';
    const limit = Number(maxLen) || 2000;
    return text.length > limit ? text.slice(0, limit) : text;
  }

  function respondWithoutData(question) {
    const cleaned = clampText(question, 2000);
    if (!cleaned) {
      return {
        answer: 'I need your electricity bill or verified billing information before I can analyze your bill.',
        assumptions: ['No question provided.'],
        confidence: 'Low'
      };
    }

    const q = cleaned.toLowerCase();
    if (/bill|billing|meter|increase|decrease|why did my bill|consumption/.test(q)) {
      return {
        answer: 'I need your electricity bill or verified billing information before I can analyze your bill.',
        assumptions: ['No verified bill data available.'],
        confidence: 'Low'
      };
    }

    if (/hello|hi|hey|who are you|what can you do/.test(q)) {
      return {
        answer: 'I am RushXArena. I can help explain verified electricity bill data, but I need actual data from your bill or meter before I can analyze it.',
        assumptions: ['General greeting.'],
        confidence: 'High'
      };
    }

    return {
      answer: 'I can explain verified electricity bill information, but I need actual data from your bill or meter before I can provide a meaningful answer.',
      assumptions: ['No verified electricity data exists yet.'],
      confidence: 'Low'
    };
  }

  function generateOfflineAnswer(question) {
    return respondWithoutData(question);
  }

  if (typeof window !== 'undefined') {
    window.RushXArenaAI = {
      chat: (question) => generateOfflineAnswer(question),
      generateOfflineAnswer,
      getContext: () => ({ bills: [], appliances: [] })
    };
  }
}());
