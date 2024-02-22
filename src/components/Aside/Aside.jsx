import Image from "next/image";
import Link from "next/link";
import { FaWpforms, FaChartBar } from "react-icons/fa6";
import { MdOutlineSettings } from "react-icons/md";
import AsideButton from "./AsideButton";
import { getCurrentUser } from "@/actions/getCurrentUser";
import LogoutButton from "./LogoutButton";

const Aside = async () => {
  const user = await getCurrentUser();

  return (
    <aside
      id="sidebar"
      className="absolute inset-y-0 left-0 z-30 flex flex-col w-[4.5rem] min-h-screen space-y-6 overflow-y-auto text-gray-100 transition duration-200 transform bg-gray-800 lg:translate-x-0 lg:relative lg:inset-0"
    >
      <div className="flex flex-col items-center flex-1 space-y-6">
        <Link
          href="#"
          className="border-b-2 flex items-center justify-center w-full p-5 lg:p-0 lg:h-20 font-bold text-white truncate whitespace-nowrap"
        >
          <Image alt="logo" src="/logo-hispam.jpg" width={100} height={100} />
        </Link>

        <nav className="flex flex-col items-center space-y-6">
          <AsideButton href={"/devops/forms"} icon={FaWpforms} />
          <AsideButton href={"/devops/dashboard"} icon={FaChartBar} />
        </nav>
      </div>
      <div className="flex flex-col items-center justify-center py-2 border-t border-gray-600 gap-2">
        {user?.rol === "administrador" && (
          <AsideButton href={"/settings"} icon={MdOutlineSettings} />
        )}
        <LogoutButton />
      </div>
    </aside>
  );
};

export default Aside;
export const dynamic = "force-dynamic";
