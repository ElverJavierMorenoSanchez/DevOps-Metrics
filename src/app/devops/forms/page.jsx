"use client";

import { useState } from "react";
import DoraForm from "./components/DoraForm";
import { clsx } from "clsx";
import GapsForm from "./components/GapsForm";
import Header from "@/components/header/Header";

const Forms = () => {
  const [doraForm, setDoraForm] = useState(true);
  return (
    <div className="w-full h-full px-10 py-10">
      <Header />
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
          DORA
        </button>
        <button
          onClick={() => {
            setDoraForm(false);
          }}
          className={clsx(
            "py-2 px-4",
            doraForm ||
              "border-2 border-slate-200 border-b-white translate-y-[2px]"
          )}
        >
          MADUREZ
        </button>
      </div>
      <div className="w-full h-full border-2 p-4">
        <div className={"flex flex-row gap-4"}>
          {doraForm ? <DoraForm /> : <GapsForm />}
        </div>
        <div className=""></div>
      </div>
    </div>
  );
};

export default Forms;
