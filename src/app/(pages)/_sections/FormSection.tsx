import { ThemeToggle } from "@/components/theme-toggle";
import Image from "next/image";
import LoginForm from "../_components/LoginForm";

export default function FormSection() {
  return (
    <div className="flex-1 flex items-start md:items-center justify-center p-6 ">
      <div className="w-full max-w-md relative">
        <div className="w-40 h-40 xl:w-50 xl:h-50 hidden md:flex absolute top-[-100px] right-[-100px] xl:top-[-120px] xl:right-[-120px] rotate-90">
          <Image
            fill
            className="object-contain"
            src="/spring.png"
            alt="Imagen2"
          />
        </div>
        <div className="bg-white dark:bg-[#36496c] rounded-xl inset-shadow-sm inset-shadow-indigo-500 overflow-hidden transition-colors duration-300">
          <div className="px-6 py-8">
            <div className="relative text-center mb-8">
              <h2 className="dark:text-white text-gray-800 text-2xl font-bold">
                Bienvenido
              </h2>
              <div className="absolute top-0 right-0">
                <ThemeToggle />
              </div>
              <p className="text-gray-400 mt-2">
                Ingresa a tu cuenta para continuar
              </p>
            </div>

            <LoginForm />
          </div>
        </div>

        <div className="mt-6 text-center text-gray-500 text-sm">
          <p>¿Problemas para iniciar sesión? Contacta a soporte técnico</p>
        </div>
      </div>
    </div>
  );
}
