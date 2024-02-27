"use client";

import { useEffect, useState } from "react";
import { clsx } from "clsx";
import UserTable from "./components/UserTable";
import getUsers from "@/actions/getUsers";
import axios from "axios";
import toast from "react-hot-toast";
import Button from "./components/Button";

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

  const handleDelete = async (id) => {
    try {
      if (confirm("Estás seguro?")) {
        const user = await axios.delete(`/api/register/${id}`);
        toast.success("Se eliminó con éxito");
        getData();
      }
    } catch (error) {
      toast.error("Ocurrio un error vuelve a intentarlo");
    }
  };

  return (
    <div className="w-full h-full px-10 py-10">
      <Button
        onClick={async () => {
          const data = await axios.delete(`/api/data`);

          console.log("🚀 ~ onClick={ ~ data:", data);
        }}
      >
        Hello
      </Button>
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
          <UserTable
            data={data}
            getData={getData}
            handleDelete={handleDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default Settings;
