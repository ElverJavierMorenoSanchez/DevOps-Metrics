"use client";

import SelectForm from "./SelectForm";
import { useForm } from "react-hook-form";
import axios from "axios";
import InputGroup from "./InputGroup";
import { useState } from "react";
import { countries, months } from "@/helpers/AditionalData";
import toast from "react-hot-toast";

const ModalFormGaps = ({ metric, getData }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [pais, setPais] = useState(metric?.pais);
  const [mes, setMes] = useState(metric?.mes);
  const {
    id,
    nombreItemMedir,
    valorMedicion,
    valorMeta,
    avanceEstimado,
    avanceReal,
  } = metric;

  const values = [valorMedicion, valorMeta, avanceReal, avanceEstimado];

  const handlePais = (event) => {
    setPais(event.target.value);
  };
  const handleMes = (event) => {
    setMes(event.target.value);
  };

  const onSubmit = async (data) => {
    console.log("🚀 ~ onSubmit ~ data:", data);
    try {
      const response = await axios.put(`/api/gapMetrics/${id}`, {
        pais,
        mes,
        ...data,
      });

      console.log(response);
      toast.success("Guardado exitoso");
      getData(mes, pais);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="w-full flex flex-col items-center justify-center gap-4">
      <form
        className="w-full flex flex-col gap-2"
        onSubmit={handleSubmit(onSubmit)}
      >
        <div className="w-1/2 flex flex-col gap-2">
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
        </div>

        <hr />
        <div className="w-full flex flex-row gap-4 items-center">
          <div className="w-1/3 text-end"></div>
          <div className="w-full flex flex-row gap-4 py-2">
            <div className="w-1/2 text-center font-semibold">
              Valor Medición
            </div>
            <div className="w-1/2 text-center font-semibold">Valor Meta</div>
            <div className="w-1/2 text-center font-semibold">Avance Real</div>
            <div className="w-1/2 text-center font-semibold">
              Avance Estimado
            </div>
          </div>
        </div>
        {nombreItemMedir === "GAP Configuration Management" && (
          <InputGroup
            label={"GAP Configuration Management:"}
            id={"confManage"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Build Management" && (
          <InputGroup
            label={"GAP Build Management:"}
            id={"buildManage"}
            register={register}
            errors={errors}
            values={values}
          />
        )}

        {nombreItemMedir === "GAP Testing and QA" && (
          <InputGroup
            label={"GAP Testing and QA:"}
            id={"testingQA"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Deployment  automation" && (
          <InputGroup
            label={"GAP Deployment  automation:"}
            id={"deployAuto"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Release Management" && (
          <InputGroup
            label={"GAP Release Management:"}
            id={"releaseManage"}
            register={register}
            errors={errors}
            values={values}
          />
        )}

        {nombreItemMedir === "GAP Environmet provisioning" && (
          <InputGroup
            label={"GAP Environmet provisioning:"}
            id={"environmentProvisoning"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Data Management" && (
          <InputGroup
            label={"GAP Data Management:"}
            id={"dataManage"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Monitoring" && (
          <InputGroup
            label={"GAP Monitoring:"}
            id={"monitoring"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Security" && (
          <InputGroup
            label={"GAP Security:"}
            id={"security"}
            register={register}
            errors={errors}
            values={values}
          />
        )}
        {nombreItemMedir === "GAP Teams Organization" && (
          <InputGroup
            label={"GAP Teams Organization:"}
            id={"teamsOrganization"}
            register={register}
            errors={errors}
            values={values}
          />
        )}

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

export default ModalFormGaps;
