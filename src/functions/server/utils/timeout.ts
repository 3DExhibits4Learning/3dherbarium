export const timeout = async (ms: number) => {
  return new Promise(res => setTimeout(res, ms));
};