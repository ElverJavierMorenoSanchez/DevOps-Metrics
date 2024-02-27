"use client";

import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { countries, months } from "@/helpers/AditionalData";
import Loader from "@/components/Loader";
import { validatePermission } from "@/helpers/Validations";

const ModalFormDora = ({ metric, getData }) => {
  const { id, valor_medicion, valor_medicion_porcentual, nombre_item_medir } =
    metric;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    defaultValues: {
      valorMedicion: valor_medicion,
      valorMedicionPorcentual: valor_medicion_porcentual * 100,
      leadTime: valor_medicion,
    },
  });

  const [pais, setPais] = useState(metric?.pais);
  const [mes, setMes] = useState(metric?.mes);
  const [loading, setLoading] = useState(false);

  const handlePais = (event) => {
    setPais(event.target.value);
  };
  const handleMes = (event) => {
    setMes(event.target.value);
  };

  const onSubmit = async (data) => {
    try {
      const validate = validatePermission(pais, mes);

      if (!validate) return;

      setLoading(true);

      const response = await axios.put(`/api/doraMetrics/${id}`, {
        pais,
        mes,
        nombreItemMedir: nombre_item_medir,
        ...data,
      });

      setValue("valorMedicion", "");
      setValue("leadTime", "");
      setValue("valorMedicionPorcentual", "");
      toast.success("Guardado exitoso");
      getData(mes, pais);
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
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
        {nombre_item_medir.trim() === "Cantidad de Despliegues" && (
          <InputForm
            id="valorMedicion"
            label={"Cant. Despliegues:"}
            placeholder="0"
            register={register}
            errors={errors}
          />
        )}

        {nombre_item_medir.trim() === "Lead Time DevOps" && (
          <InputForm
            id="leadTime"
            label={"Lead Time:"}
            placeholder="10"
            register={register}
            errors={errors}
          />
        )}

        {nombre_item_medir.trim() === "Tasa de Éxito" && (
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
