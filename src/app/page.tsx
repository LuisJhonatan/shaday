"use client";
export default function Home() {
  const handleClick = () => {
    fetch("/api/auth/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: "luis@gmail.com",
        password: "123456Aaa",
      }),
    })
      .then((res) => res.json())
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  const handleClick2 = () => {
    fetch("/api/auth/change-password", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        old_password: "123456Abc",
        new_password: "123456Aaa",
      }),
      credentials: "include",
    })
      .then((res) => {
        return res.json();
      })
      .then((data) => console.log(data))
      .catch((err) => console.error(err));
  };

  return (
    <div>
      <div className="cursor-pointer" onClick={handleClick}>
        CLICK
      </div>
      <div className="cursor-pointer" onClick={handleClick2}>
        CLICK2
      </div>
    </div>
  );
}
