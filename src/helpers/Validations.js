import toast from "react-hot-toast";

export const validatePermission = (pais, mes) => {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!mes || !pais) {
    toast.error("Selecciona un país y mes");
    return false;
  }
  if (!user.pais) {
    toast.error("No tienes un país asignado");
    return false;
  }
  if (user.pais !== pais) {
    toast.error("No tienes permisos para este país");
    return false;
  }
  return true;
};
