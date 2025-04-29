import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const { userData } = useSelector((x) => x.auth);
  return (
    <div>
      <div className="container flex flex-col items-center justify-center min-h-screen py-2">
        <h1>Hello {userData?.name || "User"}</h1>
        <p>Welcome to the home page!</p>
      </div>
    </div>
  );
}

export default Home;
