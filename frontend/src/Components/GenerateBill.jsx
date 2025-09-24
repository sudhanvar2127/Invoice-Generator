import { useContext } from "react";
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
    setInvoiceNumber,
    setBillData,
    allBills,
    setAllBills,
  } = useContext(BillContext);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const downloadCSV = () => {
    const rows = [];

    // --- Header Section (Company Name and Month) ---
    const currentSeller = gst ? sellers[seller] : nonGstSellerDetails;

    // Header row with company name and date (using your invoice data)
    rows.push([
      "",
      "Monthly Sales Report",
      "",
      currentSeller?.name || "Company Name",
      "",
      "",
      "",
      "",
      "",
      "",
      `Date: ${formatDate(date)}`,
      "",
    ]);

    // GST Number row
    rows.push([
      "",
      "",
      "",
      `GST No: ${currentSeller?.gstin || "N/A"}`,
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // Statement description
    rows.push([
      "",
      "",
      "",
      "Monthly GST Statement for Invoice Processing",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
      "",
    ]);

    // Column headers (exact same as Excel)
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
    ]);

    // --- Data Row (Your Invoice) ---
    const taxableValue = parseFloat(subTotal || 0);
    const cgstAmount = parseFloat(cGst || 0);
    const sgstAmount = parseFloat(sGst || 0);
    const grandTotalAmount = parseFloat(grandTotal || 0);

    // Format date like Excel (2025-04-29 00:00:00)
    const formatExcelDate = (dateStr) => {
      if (!dateStr) return "";
      const dateObj = new Date(dateStr);
      return dateObj.toISOString().split("T")[0] + " 00:00:00";
    };

    // Combine item quantities and descriptions
    const itemsDescription = addItems
      .map((item) => `${item.quantity || ""} ${item.descriptionOfGoods || ""}`)
      .join(", ");

    // Your invoice data row
    rows.push([
      "1",
      buyer.name || "",
      hsnSAC || "",
      invoiceNumber || "",
      formatExcelDate(date),
      itemsDescription,
      buyer.gstin || "",
      taxableValue,
      gstPercentage ? gstPercentage / 100 : 0,
      cgstAmount,
      sgstAmount,
      grandTotalAmount,
    ]);

    // --- Empty rows (matching Excel structure) ---
    for (let i = 0; i < 16; i++) {
      rows.push(["", "", "", "", "", "", "", "", "", "", "", ""]);
    }

    // --- Totals Section (matching Excel format) ---
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
      grandTotalAmount,
    ]);

    // GST rate breakdown
    const currentGstRate = gstPercentage || 18;

    rows.push([
      "",
      "",
      "",
      "",
      "",
      "",
      `${currentGstRate}%`,
      taxableValue,
      "",
      cgstAmount,
      sgstAmount,
      grandTotalAmount,
    ]);

    // Other rates as Nil
    const otherRates = ["12%", "5%"].filter(
      (rate) => rate !== `${currentGstRate}%`
    );
    otherRates.forEach((rate) => {
      rows.push(["", "", "", "", "", "", rate, "Nil", "", "Nil", "Nil", "Nil"]);
    });

    // --- Convert to CSV ---
    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    // --- Download ---
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Invoice_Statement_${invoiceNumber || "untitled"}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadInvoice = (e) => {
    e.preventDefault();

    const isBuyerIncomplete =
      !buyer.name || !buyer.address || !buyer.phone || !buyer.email;

    const isConsigneeIncomplete =
      !consignee.name ||
      !consignee.address ||
      !consignee.phone ||
      !consignee.email;

    if (isBuyerIncomplete && isConsigneeIncomplete) {
      toast.error("Please enter the details of Buyer and Consignee");
      return;
    }

    if (addItems.length === 0) {
      toast.error("There are no items in the invoice");
      return;
    }

    if (!invoiceNumber) {
      toast.error("Plase enter invoice number");
      return;
    }

    if (!hsnSAC) {
      toast.error("Please enter the HSN/SAC value");
      return;
    }

    if (gst && !gstPercentage) {
      toast.error("Please enter the GST Percentage");
      return;
    }

    if (gst && !ewayNumber) {
      toast.error("Please enter the E-way bill number");
      return;
    }

    const generateBillId = () => {
      return (
        Date.now().toString(36) + // timestamp in base36
        Math.random().toString(36).substring(2, 8)
      ).toUpperCase();
    };

    const newBillData = {
      id: generateBillId(),
      invoiceNumber,
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
    toast.success("Invoice generated successfully");

    downloadCSV();

    const next = getNextInvoiceNumber();
    setInvoiceNumber(next);
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
