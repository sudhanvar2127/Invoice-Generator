import React, { useContext, useEffect, useState } from "react";
import { BillContext } from "../Context/BillingContext";
import BillShow from "../Components/BillShow";

const Bills = () => {
  const { allBills } = useContext(BillContext);

  const [filterBills, setFilterBills] = useState([]);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedBillTypes, setSelectedBillTypes] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  // Handle filters
  const handleSellerFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedSellers((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  const handleBillTypeFilterChange = (e) => {
    const { value, checked } = e.target;
    setSelectedBillTypes((prev) =>
      checked ? [...prev, value] : prev.filter((v) => v !== value)
    );
  };

  // Filter bills based on filters
  useEffect(() => {
    let filtered = [...allBills];
    if (selectedSellers.length > 0) {
      filtered = filtered.filter((bill) =>
        selectedSellers.includes(bill.seller?.name)
      );
    }
    if (selectedBillTypes.length > 0) {
      filtered = filtered.filter((bill) =>
        selectedBillTypes.includes(bill.gst ? "Gst" : "Non-Gst")
      );
    }
    // Sorting:
    if (sortOption === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "invoicenumber") {
      filtered.sort((a, b) =>
        String(b.invoiceNumber).localeCompare(String(a.invoiceNumber))
      );
    }
    setFilterBills(filtered);
  }, [allBills, selectedSellers, selectedBillTypes, sortOption]);

  return (
    <div className="flex gap-10">
      {/* Filters */}
      <div className="min-w-60">
        <p className="my-2 text-xl flex items-center cursor-pointer gap-2">
          Filters
        </p>
        <div className="border border-gray-300 pl-5 py-3 mt-6">
          <p className="mb-3 text-sm font-medium">Seller Name</p>
          <div className="flex flex-col gap-2 text-sm font-light">
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Sri Kalpvrusha Printers"
                onChange={handleSellerFilterChange}
              />
              Sri Kalpvrusha Printers
            </label>
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Shree Sharada Printers"
                onChange={handleSellerFilterChange}
              />
              Shree Sharada Printers
            </label>
          </div>
        </div>

        <div className="border border-gray-300 pl-5 py-3 mt-6">
          <p className="mb-3 text-sm font-medium">Bill Type</p>
          <div className="flex flex-col gap-2 text-sm font-light">
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Gst"
                onChange={handleBillTypeFilterChange}
              />
              Gst
            </label>
            <label className="flex gap-2">
              <input
                className="w-3"
                type="checkbox"
                value="Non-Gst"
                onChange={handleBillTypeFilterChange}
              />
              Non-Gst
            </label>
          </div>
        </div>
      </div>

      {/* Bills List */}
      <div className="flex-1">
        <div className="flex justify-between text-base mb-2">
          <h1 className="text-2xl font-medium">All Bills</h1>
          <select
            className="border-2 border-gray-300 text-sm px-2"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">Sort by: Date</option>
            <option value="invoicenumber">Sort by: Invoice Number</option>
          </select>
        </div>
        <div className="flex flex-col">
          {filterBills.length === 0 ? (
            <p className="text-gray-500 mt-5">No bills found.</p>
          ) : (
            filterBills.map((bill) => <BillShow key={bill.id} bill={bill} />)
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;
