import axios from "axios";

/**
 * Retrieves gap metrics for a specific mes and pais.
 * @param {string} mes - The mes for which to retrieve the gap metrics.
 * @param {string} pais - The pais for which to retrieve the gap metrics.
 * @returns {Promise<Array>} - A promise that resolves to an array of gap metrics.
 */
const getGapsMetrics = async (mes, pais) => {
  try {
    const gaps = await axios.get("/api/gapMetrics", {
      params: { mes, pais },
    });
    console.log(gaps);
    return gaps.data;
  } catch (error) {
    console.log("🚀 ~ getGapsMetrics ~ error:", error);
    return [];
  }
};

export default getGapsMetrics;
