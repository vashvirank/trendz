import React from "react";
import { NavLink } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <div className="m-4 h-[85vh] border border-white/10 rounded flex flex-col md:flex-row items-center justify-center">
        <img
          draggable="false"
          loading="lazy"
          src="/not-found.svg"
          width="250"
          height="250"
          alt="Icon"
        />
        <div className="w-[100%] md:w-[40%] flex flex-col items-center gap-3">
          <p className="text-red-500 font-semibold text-6xl">OOPS!</p>
          <p className="text-lg tracking-[2px]">nothing found here....</p>
          <NavLink
            draggable="false"
            to="/"
            className="text-xl bg-blue-500 hover:bg-blue-600 rounded-lg px-14 py-2"
          >
            return Home
          </NavLink>
        </div>
      </div>
    </>
  );
};

export default NotFound;
