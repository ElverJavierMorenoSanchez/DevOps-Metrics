"use client";

import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import Input from "@/components/inputs/Input";
import { countries, rols } from "@/helpers/AditionalData";
import { useState } from "react";
import SelectInput from "./SelectInput";

const ModalFormUser = ({ user, getData, type }) => {
  const { id, user_name, email, pais, rol } = user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      user_name,
      email,
    },
  });
  const [_pais, setPais] = useState(pais);
  const [_rol, setRol] = useState(rol);

  const handlePais = (e) => {
    setPais(e.target.value);
  };

  const handleRol = (e) => {
    setRol(e.target.value);
  };

  const onSubmit = async (data) => {
    try {
      if (type === "update") {
        const response = await axios.put(`/api/register/${id}`, {
          ...data,
          pais: _pais,
          rol: _rol,
        });
      } else if (type === "new") {
        const response = await axios.post(`/api/register`, {
          ...data,
          pais: _pais,
          rol: _rol,
        });
      }

      toast.success("Guardado exitoso");
      getData();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <form
        className="w-96 flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Input
          label={"Nombre"}
          id={"user_name"}
          register={register}
          errors={errors}
          type={"text"}
          required={true}
        />
        <Input
          label={"Correo"}
          id={"email"}
          register={register}
          errors={errors}
          type={"text"}
          required={true}
        />
        <Input
          label={"Contraseña"}
          id={"password"}
          register={register}
          errors={errors}
          type={"password"}
          required={type === "update" ? false : true}
        />
        <SelectInput
          defaultValue={_pais}
          label={"País"}
          onChange={handlePais}
          options={countries}
          title={"Selecciona un país"}
        />
        <SelectInput
          defaultValue={_rol}
          label={"Rol"}
          onChange={handleRol}
          options={rols}
          title={"Selecciona un rol"}
        />
        <div className="w-full flex justify-center mt-4">
          <input
            type="submit"
            className="w-40 rounded-full bg-slate-200 pb-2 pt-2.5 mt-2 text-center text-sm font-mono uppercase leading-normal transition duration-150 ease-in-out hover:bg-slate-300 focus:outline-none focus:ring-0 active:bg-slate-400"
          />
        </div>
      </form>
    </div>
  );
};

export default ModalFormUser;
