export const invokeLLM = async (prompt: string): Promise<any> => {
  console.log(`[MOCK] Invoking LLM with prompt: "${prompt}"`);
  await new Promise(resolve => setTimeout(resolve, 1000));
  return { text: `Mock response for: ${prompt}` };
};