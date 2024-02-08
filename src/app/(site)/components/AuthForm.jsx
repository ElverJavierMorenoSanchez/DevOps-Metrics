"use client";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import { useCallback, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const AuthForm = () => {
  const [variant, setVariant] = useState("LOGIN");
  const [isLoading, setIsLoading] = useState(false);
  const session = useSession();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/devops/forms");
    }
  }, [session?.status, router]);

  const toggleVariant = useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const onSubmit = async (data) => {
    setIsLoading(true);

    if (variant === "REGISTER") {
      try {
        await axios.post("/api/register", data);
        const callback = await signIn("credentials", data);

        if (callback?.error) toast.error("Algo salió mal!");

        if (callback?.ok) {
          toast.success("Account created");
          router.push("/devops/forms");
        }
      } catch (error) {
        toast.error("Algo salió mal!");
      }
    }
    if (variant === "LOGIN") {
      try {
        const callback = await signIn("credentials", {
          ...data,
          redirect: false,
        });

        if (callback?.error) {
          toast.error("Credenciales incorrectas");
        }

        if (callback?.ok) {
          toast.success("Iniciaste sesión!");
          router.push("/devops/forms");
        }
      } catch (error) {
        toast.error("Algo salió mal!");
      }
    }
    setIsLoading(false);
  };

  const socialAction = async (action) => {
    setIsLoading(true);
    try {
      const callback = await signIn(action, { redirect: false });
      if (callback?.error) {
        toast.error("Invalid credentials");
      }

      if (callback?.ok) {
        toast.success("Logged in");
      }
    } catch (error) {
      toast.error("Something wrong, try later");
    }
    setIsLoading(false);
  };

  return (
    <div className="w-96 sm:mx-auto sm:max-w-md">
      <div className=" bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10 flex items-center justify-center flex-col gap-6">
        <Image
          alt=""
          src={"/coeDevOpsHispam.jpg"}
          width={"100"}
          height={"100"}
          className="rounded-full"
        />
        <form className="w-full space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              id="name"
              label="Name"
              type="text"
              register={register}
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            id="email"
            label="Correo electronico"
            type="email"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <Input
            id="password"
            label="Contraseña"
            type="password"
            register={register}
            errors={errors}
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Iniciar Sesión" : "Register"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
