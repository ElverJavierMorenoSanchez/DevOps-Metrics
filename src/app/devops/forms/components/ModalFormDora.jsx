"use client";

import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { countries, months } from "@/helpers/AditionalData";

const ModalFormDora = ({ metric, getData }) => {
  const { id, valorMedicion, valorMedicionPorcentual, nombreItemMedir } =
    metric;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      valorMedicion,
      valorMedicionPorcentual,
      leadTime: valorMedicion,
    },
  });

  const [pais, setPais] = useState(metric?.pais);
  const [mes, setMes] = useState(metric?.mes);

  const handlePais = (event) => {
    setPais(event.target.value);
  };
  const handleMes = (event) => {
    setMes(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.put(`/api/doraMetrics/${id}`, {
        pais,
        mes,
        nombreItemMedir,
        ...data,
      });

      setValue("valorMedicion", "");
      setValue("leadTime", "");
      setValue("valorMedicionPorcentual", "");
      toast.success("Guardado exitoso");
      getData(mes, pais);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <>
      <form
        className=" w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <SelectForm
          id="pais"
          label={"País:"}
          title={"Selecciona un país"}
          options={countries}
          onChange={handlePais}
          defaultValue={pais}
          disabled={true}
        />

        <SelectForm
          id="mes"
          label={"Mes:"}
          title={"Selecciona un mes"}
          options={months}
          onChange={handleMes}
          defaultValue={mes}
          disabled={true}
        />
        {nombreItemMedir === "Cantidad de Despliegues" && (
          <InputForm
            id="valorMedicion"
            label={"Cant. Despliegues:"}
            placeholder="0"
            register={register}
            errors={errors}
          />
        )}

        {nombreItemMedir === "Lead Time DevOps" && (
          <InputForm
            id="leadTime"
            label={"Lead Time:"}
            placeholder="10"
            register={register}
            errors={errors}
          />
        )}

        {nombreItemMedir === "Tasa de Éxito" && (
          <InputForm
            id="valorMedicionPorcentual"
            label={"Tasa De Éxito:"}
            placeholder="10"
            register={register}
            errors={errors}
          />
        )}

        <div className="w-full flex justify-center mt-4">
          <input
            type="submit"
            className="w-40 rounded-full bg-slate-200 pb-2 pt-2.5 mt-2 text-center text-sm font-mono uppercase leading-normal transition duration-150 ease-in-out hover:bg-slate-300 focus:outline-none focus:ring-0 active:bg-slate-400"
          />
        </div>
      </form>
    </>
  );
};

export default ModalFormDora;
