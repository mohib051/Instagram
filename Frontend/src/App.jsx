import React, { useContext } from "react";
import AppRouter from "./Router/Router";
import "./index.css";
import { Toaster } from "sonner";
import userGetAllPost  from "./hooks/userGetAllPost";

const App = () => {

  userGetAllPost()
  
  return (
      <div className="bg-white text-black h-screen w-screen overflow-x-hidden">
        <AppRouter />
        <Toaster />
      </div>  
  );
};

export default App;
