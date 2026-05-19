export const db = {
  query: async (queryString: string, params?: any[]) => {
    console.log("Executing Query:", queryString, "with parameters:", params || []);
    return [];
  }
};
