import React from "react";

const Home = () => {
  const colorStack = [
    { name: "Red", className: "bg-red-500" },
    { name: "Orange", className: "bg-orange-500" },
    { name: "Yellow", className: "bg-yellow-400 text-black" },
    { name: "Green", className: "bg-green-500" },
    { name: "Blue", className: "bg-blue-500" },
    { name: "Indigo", className: "bg-indigo-500" },
    { name: "Violet", className: "bg-violet-500" },
  ];

  return (
    <>
      <div>
        <div className="h-screen w-full bg-red-400">
          <div className="bg-white">
            <h2>Get started with Traveller</h2>
            <button>Continue</button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
