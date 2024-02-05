import axios from "axios";

const getDoraMetrics = async (mes, pais) => {
  try {
    const dora = await axios.get("/api/doraMetrics", { params: { mes, pais } });
    return dora.data;
  } catch (error) {
    console.log("🚀 ~ getDoraMetrics ~ error:", error);
    return [];
  }
};

export default getDoraMetrics;
