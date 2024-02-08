"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import UserTable from "./components/UserTable";
import getUsers from "@/actions/getUsers";

const Settings = () => {
  const [doraForm, setDoraForm] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const _data = await getUsers();
    setData(_data);
  };

  return (
    <div className="w-full h-full px-10 py-10">
      <div className="flex gap-4">
        <button
          onClick={() => {
            setDoraForm(true);
          }}
          className={clsx(
            "py-2 px-4",
            doraForm &&
              "border-2 border-slate-200 border-b-white translate-y-[2px]"
          )}
        >
          Usuarios
        </button>
      </div>
      <div className="w-full h-full border-2 p-4">
        <div className={"flex flex-row gap-4"}>
          <UserTable data={data} getData={getData} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
