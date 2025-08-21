import React from "react";
import Home from "./Pages/Home";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import GSTCalulator from "./Pages/GSTCalulator";
import Preview from "./Pages/Preview";
import Bills from "./Pages/Bills";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gstcalulator" element={<GSTCalulator />} />
        <Route path="/bills" element={<Bills />}/>
        <Route path="/preview" element={<Preview />} />
        {/* <Route path="/bills/:id" element={<BillShow />} /> */}
      </Routes>
    </div>
  );
};

export default App;
