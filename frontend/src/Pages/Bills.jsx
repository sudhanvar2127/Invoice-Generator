import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { BillContext } from "../Context/BillingContext";

const Bills = () => {
  const { allBills, setAllBills } = useContext(BillContext);
  const navigate = useNavigate();

  const [filterBills, setFilterBills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedBillTypes, setSelectedBillTypes] = useState([]);
  const [sortOption, setSortOption] = useState("date");

  // Search function
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

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

  // Delete bill handler with immediate state update
  const handleDeleteBill = (billId) => {
    if (window.confirm("Are you sure you want to delete this bill?")) {
      const updatedBills = allBills.filter((bill) => bill.id !== billId);
      setAllBills(updatedBills);
      localStorage.setItem("Bills", JSON.stringify(updatedBills));

      // Force immediate re-render by updating filterBills directly
      const newFilteredBills = filterBills.filter((bill) => bill.id !== billId);
      setFilterBills(newFilteredBills);
    }
  };

const downloadBillCSV = (bill) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatExcelDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    return dateObj.toISOString().split('T')[0] + " 00:00:00";
  };

  const rows = [];

  // Header section (matching Excel structure but for single bill)
  rows.push([
    "",
    "Bill Details",
    "",
    bill.seller?.name || "Company Name",
    "",
    "",
    "",
    "",
    "",
    "",
    `Date: ${formatDate(bill.date)}`,
    ""
  ]);

  rows.push([
    "",
    "",
    "",
    `GST No: ${bill.seller?.gstin || "N/A"}`,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  rows.push([
    "",
    "",
    "",
    `Invoice: ${bill.invoiceNumber || ""}`,
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
  ]);

  // Table headers (exact same as Excel)
  rows.push([
    "SL No.",
    "Name of Purchaser & Address",
    "HSN Code",
    "Bill No.",
    "Date",
    "Quantity",
    "Purchaser GST No.",
    "Taxable Value",
    "GST @ %",
    "CGST Amt.",
    "SGST Amt.",
    "Total Amount"
  ]);

  // Single bill data row
  const taxableValue = parseFloat(bill.subTotal || 0);
  const cgstAmount = parseFloat(bill.cGst || 0);
  const sgstAmount = parseFloat(bill.sGst || 0);
  const grandTotal = parseFloat(bill.grandTotal || 0);

  const itemsDescription = bill.items?.map(item => 
    `${item.quantity || ""} ${item.descriptionOfGoods || ""}`
  ).join(", ") || "";

  rows.push([
    "1",
    bill.buyer?.name || "",
    bill.hsnSAC || "",
    bill.invoiceNumber || "",
    formatExcelDate(bill.date),
    itemsDescription,
    bill.buyer?.gstin || "",
    taxableValue,
    bill.gst ? (bill.gstPercentage ? (bill.gstPercentage / 100) : 0.18) : 0,
    cgstAmount,
    sgstAmount,
    grandTotal
  ]);

  // Empty rows
  for(let i = 0; i < 16; i++) {
    rows.push(["", "", "", "", "", "", "", "", "", "", "", ""]);
  }

  // Total (just this one bill)
  rows.push([
    "",
    "",
    "",
    "",
    "",
    "",
    "Total",
    taxableValue,
    "",
    cgstAmount,
    sgstAmount,
    grandTotal
  ]);

  const gstRate = bill.gstPercentage || 18;
  rows.push([
    "",
    "",
    "",
    "",
    "",
    "",
    `${gstRate}%`,
    taxableValue,
    "",
    cgstAmount,
    sgstAmount,
    grandTotal
  ]);

  const csvContent = rows
    .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
    .join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `Bill_${bill.invoiceNumber || "untitled"}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

  // Filter bills based on search and filters
  useEffect(() => {
    let filtered = [...allBills];

    // Apply search filter
    if (searchQuery.trim() !== "") {
      filtered = filtered.filter(
        (bill) =>
          bill.invoiceNumber
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          bill.seller?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          bill.buyer?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          bill.consignee?.name
            ?.toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          bill.items?.some((item) =>
            item.descriptionOfGoods
              ?.toLowerCase()
              .includes(searchQuery.toLowerCase())
          )
      );
    }

    // Apply seller filter
    if (selectedSellers.length > 0) {
      filtered = filtered.filter((bill) =>
        selectedSellers.includes(bill.seller?.name)
      );
    }

    // Apply bill type filter
    if (selectedBillTypes.length > 0) {
      filtered = filtered.filter((bill) =>
        selectedBillTypes.includes(bill.gst ? "Gst" : "Non-Gst")
      );
    }

    // Apply sorting
    if (sortOption === "date") {
      filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
    } else if (sortOption === "invoicenumber") {
      filtered.sort((a, b) =>
        String(b.invoiceNumber).localeCompare(String(a.invoiceNumber))
      );
    }

    setFilterBills(filtered);
  }, [allBills, searchQuery, selectedSellers, selectedBillTypes, sortOption]);

  return (
    <div className="flex gap-10 p-6">
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
        <div className="flex justify-between text-base mb-4">
          <h1 className="text-2xl font-medium">
            All Bills ({filterBills.length})
          </h1>
          <select
            className="border-2 border-gray-300 text-sm px-2 py-1 rounded"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="date">Sort by: Date</option>
            <option value="invoicenumber">Sort by: Invoice Number</option>
          </select>
        </div>

        {/* Search Box - Moved here after All Bills heading */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by invoice number, seller, buyer, items..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full border border-gray-300 rounded px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-800 focus:border-transparent"
          />
        </div>

        <div className="space-y-4">
          {filterBills.length === 0 ? (
            <p className="text-gray-500 mt-5 text-center">
              {searchQuery
                ? `No bills found for "${searchQuery}"`
                : "No bills found."}
            </p>
          ) : (
            filterBills.map((bill) => (
              <div
                key={bill.id}
                className="border rounded-lg p-4 bg-white shadow-sm"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="font-semibold text-lg">
                      Invoice: {bill.invoiceNumber}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Date: {bill.date} | {bill.gst ? "GST" : "Non-GST"}
                    </div>
                    <div className="text-sm mt-2">
                      <span className="font-medium">Seller:</span>{" "}
                      {bill.seller?.name || "-"}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Buyer:</span>{" "}
                      {bill.buyer?.name || "-"}
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Amount:</span> ₹
                      {bill.grandTotal?.toFixed(2) || "0.00"}
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => navigate(`/bills/${bill.id}`)}
                      className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => navigate(`/bills/${bill.id}/edit`)}
                      className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => downloadBillCSV(bill)}
                      className="bg-gray-700 text-white px-3 py-1 rounded text-sm hover:bg-gray-800"
                    >
                      Download
                    </button>
                    <button
                      onClick={() => handleDeleteBill(bill.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {bill.items && bill.items.length > 0 && (
                  <div className="text-xs mt-2 text-gray-600">
                    <span className="font-medium">Items:</span>{" "}
                    {bill.items
                      .map((item) => item.descriptionOfGoods)
                      .join(", ")}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Bills;
