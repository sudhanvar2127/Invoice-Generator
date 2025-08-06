import React from "react";
import Home from "./Pages/Home";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import GSTCalulator from "./Pages/GSTCalulator";
import Bill from "./Pages/Bill";
import Preview from "./Pages/Preview";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gstcalulator" element={<GSTCalulator />} />
        <Route path="/bills" element={<Bill />} />
        <Route path="/preview" element={<Preview />} />
      </Routes>
    </div>
  );
};

export default App;
