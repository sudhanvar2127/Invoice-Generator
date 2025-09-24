import React from "react";
import Home from "./Pages/Home";
import { ToastContainer, toast } from 'react-toastify';
import Navbar from "./Components/Navbar";
import { Route, Routes } from "react-router-dom";
import GSTCalulator from "./Pages/Settings";
import Preview from "./Pages/Preview";
import Bills from "./Pages/Bills";
import Settings from "./Pages/Settings";
import BillViewer from "./Pages/BillViewer";
import BillEdit from "./Pages/BillEdit";

const App = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/bills" element={<Bills />}/>
        <Route path="/preview" element={<Preview />} />
        <Route path="/bills/:id" element={<BillViewer />} />
        <Route path="/bills/:id/edit" element={<BillEdit />} />
      </Routes>
    </div>
  );
};

export default App;