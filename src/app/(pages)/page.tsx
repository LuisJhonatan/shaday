"use client";
import Image from "next/image";
import HeaderSection from "./_sections/HeaderSection";
import FormSection from "./_sections/FormSection";

export default function Home() {
  // const handleClick = () => {
  //   fetch("/api/auth/login", {
  //     method: "POST",
  //     credentials: "include",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       email: "luis@gmail.com",
  //       password: "123456Aaa",
  //     }),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // };

  // const handleClick2 = () => {
  //   fetch("/api/auth/change-password", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       old_password: "123456Abc",
  //       new_password: "123456Aaa",
  //     }),
  //     credentials: "include",
  //   })
  //     .then((res) => {
  //       return res.json();
  //     })
  //     .then((data) => console.log(data))
  //     .catch((err) => console.error(err));
  // };

  return (
    <section className="overflow-hidden max-w-7xl mx-auto">
      <main className="min-h-screen flex flex-col">
        <HeaderSection />

        <div className="w-[25%] h-100 max-w-100 hidden md:flex absolute top-[35%] animate-[bounce_3s_ease-in-out_infinite] z-10">
          <Image fill className="object-contain" src="/cog.png" alt="Image" />
        </div>

        <FormSection />
      </main>
    </section>
  );
}
