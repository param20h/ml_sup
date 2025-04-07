// src/api/checkUrl.js
import axios from 'axios';

export const checkUrl = async (url) => {
  try {
    const response = await axios.get(`http://localhost:8000/check?url=${encodeURIComponent(url)}`);
    return response.data;
  } catch (error) {
    console.error("API error:", error);
    return { message: "❌ Could not check the URL." };
  }
};
