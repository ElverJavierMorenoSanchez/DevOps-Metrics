"use client";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { PiUserCircleThin } from "react-icons/pi";

const Header = () => {
  const [user, setUser] = useState({});

  const getUser = async () => {
    const session = await getSession();
    setUser(session.user);
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <div className="flex justify-end">
      <div className="inline-block px-5">
        <div className="flex flex-row p-3 items-center justify-end bg-slate-50 gap-2 text-black rounded-lg">
          {user?.email}
          <PiUserCircleThin size={"1.5rem"} />
        </div>
      </div>
    </div>
  );
};

export default Header;
export const dynamic = "force-dynamic";
