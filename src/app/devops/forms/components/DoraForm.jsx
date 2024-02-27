"use client";

import InputForm from "./InputForm";
import SelectForm from "./SelectForm";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useEffect, useState } from "react";
import DoraTable from "./DoraTable";
import getDoraMetrics from "@/actions/getDoraMetrics";
import toast from "react-hot-toast";
import { countries, months } from "@/helpers/AditionalData";
import Loader from "@/components/Loader";
import { validatePermission } from "@/helpers/Validations";

const DoraForm = () => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  const [pais, setPais] = useState("");
  const [mes, setMes] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData(mes, pais);
  }, [mes, pais]);

  const getData = async (_mes, _pais) => {
    if (!_mes || !_pais) return;
    const _data = await getDoraMetrics(_mes, _pais);
    setData(_data);
  };

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
      const response = await axios.post("/api/doraMetrics", {
        pais,
        mes,
        valorMedicion: data.valorMedicion || 0,
        leadTime: data.leadTime || 0,
        valorMedicionPorcentual: data.valorMedicionPorcentual || 0,
      });

      getData(mes, pais);
      setValue("valorMedicion", "");
      setValue("leadTime", "");
      setValue("valorMedicionPorcentual", "");
      toast.success("Guardado exitoso");
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
        />

        <SelectForm
          id="mes"
          label={"Mes:"}
          title={"Selecciona un mes"}
          options={months}
          onChange={handleMes}
        />
        <InputForm
          id="valorMedicion"
          label={"Cant. Despliegues:"}
          placeholder="0"
          register={register}
          errors={errors}
        />
        <InputForm
          id="leadTime"
          label={"Lead Time:"}
          placeholder="0"
          register={register}
          errors={errors}
        />
        <InputForm
          id="valorMedicionPorcentual"
          label={"Tasa De Éxito:"}
          placeholder="0"
          register={register}
          errors={errors}
        />

        <div className="w-full flex justify-center mt-4">
          <input
            type="submit"
            className="w-40 rounded-full bg-slate-200 pb-2 pt-2.5 mt-2 text-center text-sm font-mono uppercase leading-normal transition duration-150 ease-in-out hover:bg-slate-300 focus:outline-none focus:ring-0 active:bg-slate-400"
          />
        </div>
      </form>
      <DoraTable data={data} getData={getData} />
    </>
  );
};

export default DoraForm;
