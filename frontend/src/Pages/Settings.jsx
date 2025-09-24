import React, { useContext, useMemo } from "react";
import { BillContext } from "../Context/BillingContext";
import { toast, ToastContainer } from "react-toastify";
import { Trash2, RotateCcw, FileText, Hash } from "lucide-react";

const Settings = () => {
  const { allBills, clearAllBills, resetInvoiceNumber, invoiceNumber } =
    useContext(BillContext);

  // Count GST and Non-GST bills
  const { gstCount, nonGstCount } = useMemo(() => {
    let gstCount = 0;
    let nonGstCount = 0;
    allBills.forEach((bill) => {
      if (bill.gst) gstCount++;
      else nonGstCount++;
    });
    return { gstCount, nonGstCount };
  }, [allBills]);

  const handleClear = () => {
    clearAllBills();
    toast.success("All bills cleared successfully!");
  };

  const handleResetInvoice = () => {
    resetInvoiceNumber();
    toast.info("🔄 Invoice number reset for the current financial year!");
  };

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-8">
      {/* Toast Container */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h1 className="text-3xl font-bold text-center">⚙ Settings</h1>

      {/* Current Invoice Number */}
      <div className="bg-white shadow rounded-2xl p-6 flex items-center space-x-4">
        <Hash className="text-black" size={32} />
        <div>
          <p className="text-gray-600 text-sm">Current Invoice Number</p>
          <p className="text-xl font-semibold text-black">
            {invoiceNumber || "Not Generated"}
          </p>
        </div>
      </div>

      {/* Bill Statistics */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-3">
        <div className="flex items-center space-x-3">
          <FileText className="text-blue-500" size={28} />
          <h2 className="text-xl font-semibold">Bill Statistics</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 mt-4 text-gray-700">
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-blue-600">{gstCount}</p>
            <p className="text-sm">GST Bills</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <p className="text-lg font-bold text-green-600">{nonGstCount}</p>
            <p className="text-sm">Non-GST Bills</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg col-span-2 text-center">
            <p className="text-lg font-bold text-gray-800">{allBills.length}</p>
            <p className="text-sm">Total Bills</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="bg-white shadow rounded-2xl p-6 space-y-4">
        <button
          onClick={handleClear}
          className="w-full flex items-center justify-center space-x-2 bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl font-semibold transition"
        >
          <Trash2 size={20} /> <span>Clear All Bills</span>
        </button>

        <button
          onClick={handleResetInvoice}
          className="w-full flex items-center justify-center space-x-2 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold transition"
        >
          <RotateCcw size={20} /> <span>Reset Invoice Number</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;