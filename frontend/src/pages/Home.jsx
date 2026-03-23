import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat md:hidden"
        style={{ backgroundImage: "url('/bg.png')" }}
      />
      <div
        className="absolute inset-0 z-0 bg-center bg-cover bg-no-repeat hidden md:block"
        style={{ backgroundImage: "url('/bg_laptop.png')" }}
      />

      <div className="relative z-10 h-screen pt-8 flex justify-between flex-col w-full">
        <img
          className="w-50 ml-8"
          src="/traveller.png"
          alt="Traveller logo"
        />

        <div className="bg-white pb-7 py-5 px-10">
          <h2 className="text-3xl font-bold text-center">Get started with Traveller</h2>
          <Link
            to="/login"
            className="w-full bg-black text-white py-3 px-8 rounded-xl mt-3 cursor-pointer font-semibold tracking-wide shadow-lg hover:bg-neutral-800 hover:shadow-xl active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-200 text-center block"
          >
            Continue
          </Link>
          </div>
      </div>
    </div>
  );
};

export default Home;
