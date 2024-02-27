"use client";

import SelectForm from "./SelectForm";
import { useForm } from "react-hook-form";
import axios from "axios";
import InputGroup from "./InputGroup";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import GapsTable from "./GapsTable";
import getGapsMetrics from "@/actions/getGapsMetrics";
import { countries, months } from "@/helpers/AditionalData";
import SwitchButton from "@/components/Buttons/SwitchButton";
import { FaEdit, FaWpforms } from "react-icons/fa";
import Loader from "@/components/Loader";
import { validatePermission } from "@/helpers/Validations";

const GapsForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [pais, setPais] = useState("");
  const [mes, setMes] = useState("");
  const [data, setData] = useState([]);
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getData(mes, pais);
  }, [mes, pais]);

  const getData = async (_mes, _pais) => {
    if (!_mes || !_pais) return;
    const _data = await getGapsMetrics(_mes, _pais);
    setData(_data);
  };

  const handlePais = (event) => {
    setPais(event.target.value);
  };
  const handleMes = (event) => {
    setMes(event.target.value);
  };
  const handleChange = () => {
    setChecked(!checked);
    getData(mes, pais);
  };

  const onSubmit = async (data) => {
    try {
      const validate = validatePermission(pais, mes);

      if (!validate) return;

      setLoading(true);
      const response = await axios.post("/api/gapMetrics", {
        pais,
        mes,
        ...data,
      });

      getData(mes, pais);
      toast.success("Guardado exitoso");
      reset();
      setLoading(false);
    } catch (error) {
      console.log("🚀 ~ onSubmit ~ error:", error);
      toast.error(error.response.data.message);
      setLoading(false);
    }
  };

  return (
    <>
      {loading && <Loader />}
      <div className="w-full flex flex-col gap-4">
        <form
          className="w-full flex flex-col gap-2"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="w-full flex flex-row items-center justify-between">
            <div className="w-1/2 flex flex-col gap-2">
              <SelectForm
                id="pais"
                label={"País:"}
                title={"Selecciona un país"}
                options={countries}
                onChange={handlePais}
                defaultValue={pais}
              />
              <SelectForm
                id="mes"
                label={"Mes:"}
                title={"Selecciona un mes"}
                options={months}
                onChange={handleMes}
                defaultValue={mes}
              />
            </div>
            <SwitchButton
              option1={<FaWpforms size={"1.5rem"} color="#6c6c6c" />}
              option2={<FaEdit size={"1.5rem"} color="#6c6c6c" />}
              onChange={handleChange}
              checked={checked}
            />
          </div>
          <hr />
          {checked || (
            <>
              <div className="w-full flex flex-row gap-4 items-center">
                <div className="w-1/3 text-end"></div>
                <div className="w-full flex flex-row gap-4 py-2">
                  <div className="w-1/2 text-center font-semibold">
                    Valor Medición
                  </div>
                  <div className="w-1/2 text-center font-semibold">
                    Valor Meta
                  </div>
                  <div className="w-1/2 text-center font-semibold">
                    Avance Real
                  </div>
                  <div className="w-1/2 text-center font-semibold">
                    Avance Estimado
                  </div>
                </div>
              </div>
              <InputGroup
                label={"GAP Configuration Management:"}
                id={"confManage"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Build Management:"}
                id={"buildManage"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Testing and QA:"}
                id={"testingQA"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Deployment  automation:"}
                id={"deployAuto"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Release Management:"}
                id={"releaseManage"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Environmet provisioning:"}
                id={"environmentProvisoning"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Data Management:"}
                id={"dataManage"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Monitoring:"}
                id={"monitoring"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Security:"}
                id={"security"}
                register={register}
                errors={errors}
              />
              <InputGroup
                label={"GAP Teams Organization:"}
                id={"teamsOrganization"}
                register={register}
                errors={errors}
              />

              <div className="w-full flex justify-center mt-4">
                <input
                  type="submit"
                  className="w-40 rounded-full bg-slate-200 pb-2 pt-2.5 mt-2 text-center text-sm font-mono uppercase leading-normal transition duration-150 ease-in-out hover:bg-slate-300 focus:outline-none focus:ring-0 active:bg-slate-400"
                />
              </div>
            </>
          )}
        </form>
        {checked && <GapsTable data={data} getData={getData} />}
      </div>
    </>
  );
};

export default GapsForm;
