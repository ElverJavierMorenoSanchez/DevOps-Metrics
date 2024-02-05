import axios from "axios";

const getGapsMetrics = async (mes, pais) => {
  try {
    const gaps = await axios.get("/api/gapMetrics", { params: { mes, pais } });
    return gaps.data;
  } catch (error) {
    console.log("🚀 ~ getGapsMetrics ~ error:", error);
    return [];
  }
};

export default getGapsMetrics;
