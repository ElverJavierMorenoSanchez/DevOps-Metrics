"use client";
import { MdLogout } from "react-icons/md";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const LogoutButton = () => {
  const router = useRouter();
  return (
    <button
      className="p-2 transition-colors duration-300 rounded-lg group hover:bg-white"
      onClick={async () => {
        await signOut();
      }}
    >
      <MdLogout size="1.3em" />
    </button>
  );
};

export default LogoutButton;
