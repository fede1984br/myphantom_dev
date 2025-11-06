/**
 * Defines the expected response structure from the LLM.
 */
export interface LLMResponse {
  text: string;
  confidence: number;
  metadata?: Record<string, any>;
}

/**
 * Simulates invoking a Large Language Model with a given prompt.
 * @param prompt - The input text to send to the LLM.
 * @returns A promise that resolves with the mock LLM response.
 */
export const invokeLLM = async (prompt: string): Promise<LLMResponse> => {
  console.log(`[MOCK] Invoking LLM with prompt: "${prompt}"`);

  // Simulate a network delay of 1 second
  await new Promise(resolve => setTimeout(resolve, 1000));

  const mockResponse: LLMResponse = {
    text: `This is a mock response for the prompt: "${prompt}"`,
    confidence: 0.95,
  };

  console.log('[MOCK] Received LLM response:', mockResponse);
  return mockResponse;
};