"use client";
import Button from "@/components/Button";
import Input from "@/components/inputs/Input";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getSession, signIn, useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { getUser } from "@/actions/getUser";

/**
 * AuthForm component for handling user authentication.
 *
 * @component
 * @returns {JSX.Element} AuthForm component
 */
const AuthForm = () => {
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

  /**
   * Handles the form submission.
   * @param {Object} data - The form data.
   * @returns {Promise<void>} - A promise that resolves when the submission is complete.
   */
  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const callback = await signIn("credentials", {
        ...data,
        redirect: false,
      });

      if (callback?.error) {
        toast.error("Credenciales incorrectas");
      }

      if (callback?.ok) {
        const session = await getSession();

        if (!session?.user?.email) return;

        const currentUser = await getUser(session?.user?.email);

        if (!currentUser) {
          toast.error("Algo salió mal!");
          signOut();
          return;
        }

        localStorage.setItem("user", JSON.stringify(currentUser));

        toast.success("Iniciaste sesión!");
        router.push("/devops/forms");
      }
    } catch (error) {
      toast.error("Algo salió mal!");
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
          <Input
            id="email"
            label="Usuario"
            type="text"
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
              Iniciar Sesión
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthForm;
