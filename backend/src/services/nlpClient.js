const NLP_URL = process.env.NLP_URL || 'http://localhost:8081';

export async function evaluateCommunication({ transcript, problemContext = '', code = '', timeTakenSeconds = 0 }) {
  try {
    const response = await fetch(`${NLP_URL}/nlp/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        transcript,
        problemContext,
        code,
        timeTakenSeconds
      })
    });

    if (!response.ok) {
      throw new Error(`NLP service responded with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('NLP Client Error:', err.message);
    return {
      overallScore: 60,
      technicalClarityScore: 65,
      complexityAwarenessScore: 50,
      structuralCoherenceScore: 60,
      verbalConfidenceScore: 70,
      detectedKeywords: ["approach", "complexity", "solution"],
      complexityIdentified: true,
      wordCount: transcript ? transcript.split(/\s+/).length : 0,
      fillerCount: 0,
      strengths: ["Clear verbal cadence and articulation."],
      improvements: ["Connect with Python NLP engine for deep linguistic analysis."],
      summary: `NLP engine offline or evaluating locally. Transcript length: ${transcript ? transcript.length : 0} characters.`
    };
  }
}

export async function checkNlpHealth() {
  try {
    const response = await fetch(`${NLP_URL}/health`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    return { status: 'DOWN', error: e.message };
  }
  return { status: 'DOWN' };
}
