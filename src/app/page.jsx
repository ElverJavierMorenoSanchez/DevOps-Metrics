import Navbar from "@/components/Navbar";
import Link from "next/link";

const Home = () => {
  return (
    <div className="w-full h-screen">
      <Navbar />
      <div className="w-full h-full flex flex-row justify-center items-center">
        <div className="w-1/3 flex flex-col gap-3">
          <h1 className="font-mono font-semibold text-2xl">
            DevOps: Un Viaje Ágil
          </h1>
          <p className="font-mono text-md">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Earum
            impedit cumque
          </p>
          <Link
            type="button"
            href="/devops/forms"
            className="w-40 rounded-full bg-slate-200 pb-2 pt-2.5 mt-2 text-center text-sm font-mono uppercase leading-normal transition duration-150 ease-in-out hover:bg-slate-300 focus:outline-none focus:ring-0 active:bg-slate-400"
          >
            Colocar Métricas
          </Link>
        </div>
        <div className="w-1/2"></div>
      </div>
    </div>
  );
};

export default Home;
