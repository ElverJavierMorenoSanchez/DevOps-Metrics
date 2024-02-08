import { getCurrentUser } from "@/actions/getCurrentUser";
import Aside from "@/components/Aside/Aside";

const SettingLayout = async ({ children }) => {
  const user = await getCurrentUser();

  return (
    <div className="flex flex-row">
      <Aside />
      {user.rol === "administrador" && children}
    </div>
  );
};

export default SettingLayout;
