import axios from "axios";

/**
 * Retrieves Dora metrics for a specific mes and pais.
 * @param {string} mes - The mes for which to retrieve the metrics.
 * @param {string} pais - The pais for which to retrieve the metrics.
 * @returns {Promise<Array>} - A promise that resolves to an array of Dora metrics.
 */
const getDoraMetrics = async (mes, pais) => {
  try {
    const dora = await axios.get("/api/doraMetrics", {
      params: { mes, pais },
    });
    console.log(dora);
    return dora.data;
  } catch (error) {
    console.log("🚀 ~ getDoraMetrics ~ error:", error);
    return [];
  }
};

export default getDoraMetrics;
