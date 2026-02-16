import { useContext, useEffect } from "react";
import React from "react";
import { toast } from "react-toastify";
import { BillContext } from "../Context/BillingContext";

const GenerateBill = () => {
  const {
    sellers,
    seller,
    gst,
    buyer,
    consignee,
    date,
    invoiceNumber,
    deliveryNote,
    modeAndTermsOfPayment,
    referenceNumber,
    otherReference,
    buyersOrderNumber,
    dated,
    dispatchDocNumber,
    deliveryDateNote,
    ewayNumber,
    dispatchThrough,
    destination,
    termsOfDelivery,
    addItems,
    descriptionOfGoods,
    hsnSAC,
    quantity,
    rate,
    amount,
    roundOff,
    gstPercentage,
    subTotal,
    gstAmount,
    grandTotal,
    cGst,
    sGst,
    getNextInvoiceNumber,
    setBillData,
    allBills,
    setAllBills,
    setInvoiceNumber,
    kindAttn
  } = useContext(BillContext);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const downloadCSV = (currentInvoice) => {
    const rows = [];

    const currentSeller = gst ? sellers[seller] : null; // adjust if using non-GST sellers

    // Header rows
    rows.push([
      "",
      "Monthly Sales Report",
      "",
      currentSeller?.name || "Company",
      "",
      "",
      "",
      "",
      "",
      "",
      `Date: ${formatDate(date)}`,
    ]);
    rows.push(["", "", "", `GST No: ${currentSeller?.gstin || "N/A"}`]);
    rows.push(["", "", "", "Monthly GST Statement for Invoice Processing"]);
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
      "Total Amount",
      "Kind Attn"
    ]);

    const itemsDescription = addItems
      .map((item) => `${item.quantity || ""} ${item.descriptionOfGoods || ""}`)
      .join(", ");

    // Invoice data row
    rows.push([
      "1",
      buyer.name || "",
      hsnSAC || "",
      currentInvoice,
      new Date(date).toISOString().split("T")[0] + " 00:00:00",
      itemsDescription,
      buyer.gstin || "",
      subTotal || 0,
      gstPercentage || 0,
      cGst || 0,
      sGst || 0,
      grandTotal || 0,
      kindAttn || ""
    ]);

    // Empty rows for format
    for (let i = 0; i < 16; i++) rows.push(Array(12).fill(""));

    // Totals
    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      "Total",
      subTotal,
      "",
      cGst,
      sGst,
      grandTotal,
    ]);
    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      `${gstPercentage || 18}%`,
      subTotal,
      "",
      cGst,
      sGst,
      grandTotal,
    ]);
    ["12%", "5%"]
      .filter((r) => r !== `${gstPercentage || 18}%`)
      .forEach((r) => {
        rows.push(["", "", "", "", "", "", r, "Nil", "", "Nil", "Nil", "Nil"]);
      });

    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_Statement_${currentInvoice}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (e) => {
    e.preventDefault();

    // validation checks
    if (!buyer.name && !consignee.name) {
      toast.error("Please enter the details of Buyer and Consignee");
      return;
    }

    if (addItems.length === 0) {
      toast.error("There are no items in the invoice");
      return;
    }

    if (gst && !hsnSAC) {
      toast.error("Please enter the HSN/SAC value");
      return;
    }

    if (gst && !gstPercentage) {
      toast.error("Please enter the GST Percentage");
      return;
    }

    const currentInvoice = getNextInvoiceNumber();
    setInvoiceNumber(currentInvoice);

    const generateBillId = () =>
      (
        Date.now().toString(36) + Math.random().toString(36).substring(2, 8)
      ).toUpperCase();

    const newBillData = {
      id: generateBillId(),
      invoiceNumber: currentInvoice,
      date,
      deliveryNote,
      modeAndTermsOfPayment,
      referenceNumber,
      otherReference,
      buyersOrderNumber,
      dated,
      dispatchDocNumber,
      deliveryDateNote,
      dispatchThrough,
      destination,
      termsOfDelivery,
      ewayNumber,
      hsnSAC,
      gst,
      gstPercentage,
      cGst,
      sGst,
      gstAmount,
      subTotal,
      roundOff,
      grandTotal,
      seller: sellers[seller],
      buyer,
      consignee,
      items: addItems,
    };

    const updatedBills = [...allBills, newBillData];
    setAllBills(updatedBills);
    localStorage.setItem("Bills", JSON.stringify(updatedBills));
    setBillData(newBillData);

    window.print();
    toast.success(`Invoice ${currentInvoice} generated successfully`);
    downloadCSV(currentInvoice);
  };

  return (
    <div className="flex justify-end items-center w-full my-2 no-print">
      <button
        type="button"
        onClick={handleDownloadInvoice}
        className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-[20%] hover:bg-gray-950 cursor-pointer"
      >
        Download Invoice
      </button>
    </div>
  );
};

export default GenerateBill;
