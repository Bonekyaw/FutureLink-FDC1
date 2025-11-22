export const fetchApi = async (endpoint: string, options = {}) => {
  const BASE_URL = import.meta.env.VITE_API_URL;

  const response = await fetch(`${BASE_URL}/${endpoint}`, options);

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  return response.json();
};
