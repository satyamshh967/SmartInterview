const EVALUATOR_URL = process.env.EVALUATOR_URL || 'http://localhost:8082';

export async function evaluateCode({ language, code, testCases, timeLimitMs = 3000 }) {
  try {
    const response = await fetch(`${EVALUATOR_URL}/evaluate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        language,
        code,
        testCases,
        timeLimitMs
      })
    });

    if (!response.ok) {
      throw new Error(`Evaluator service responded with status ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    console.error('Evaluator Client Error:', err.message);
    // If external service is unavailable or in mock fallback mode
    return {
      status: 'RUNTIME_ERROR',
      totalTestCases: testCases ? testCases.length : 0,
      passedTestCases: 0,
      totalExecutionTimeMs: 0,
      peakMemoryKb: 0,
      compilationError: `Could not reach C++ Evaluation Engine at ${EVALUATOR_URL}. Details: ${err.message}`,
      details: (testCases || []).map(tc => ({
        id: tc.id,
        passed: false,
        input: tc.input,
        expectedOutput: tc.expectedOutput,
        actualOutput: '',
        executionTimeMs: 0,
        memoryKb: 0,
        error: `Evaluator connection error: ${err.message}`,
        isHidden: tc.isHidden
      }))
    };
  }
}

export async function checkEvaluatorHealth() {
  try {
    const response = await fetch(`${EVALUATOR_URL}/health`);
    if (response.ok) {
      return await response.json();
    }
  } catch (e) {
    return { status: 'DOWN', error: e.message };
  }
  return { status: 'DOWN' };
}
