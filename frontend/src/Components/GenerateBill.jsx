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

    // --- Seller Section ---
    const currentSeller = sellers[seller];
    if (currentSeller) {
      rows.push(["Seller Details"]);
      rows.push(["Name", currentSeller.name || ""]);
      rows.push(["Address", currentSeller.address || ""]);
      rows.push(["Phone", currentSeller.phone || ""]);
      rows.push(["Email", currentSeller.email || ""]);
      if (currentSeller.gstin) rows.push(["GSTIN", currentSeller.gstin]);
      rows.push([]);
    }

    // --- Buyer Section ---
    rows.push(["Buyer Details"]);
    rows.push(["Name", buyer.name || ""]);
    rows.push(["Address", buyer.address || ""]);
    rows.push(["Phone", buyer.phone || ""]);
    rows.push(["Email", buyer.email || ""]);
    if (buyer.gstin) rows.push(["GSTIN", buyer.gstin]);
    rows.push([]);

    // --- Consignee Section ---
    rows.push(["Consignee Details"]);
    rows.push(["Name", consignee.name || ""]);
    rows.push(["Address", consignee.address || ""]);
    rows.push(["Phone", consignee.phone || ""]);
    rows.push(["Email", consignee.email || ""]);
    if (consignee.gstin) rows.push(["GSTIN", consignee.gstin]);
    rows.push([]);

    // --- Invoice Header Information ---
    rows.push(["Invoice Details"]);
    rows.push(["Invoice Number", invoiceNumber || ""]);
    rows.push(["Date", formatDate(date) || ""]);
    rows.push(["Delivery Note", deliveryNote || ""]);
    rows.push(["Mode/Terms of Payment", modeAndTermsOfPayment || ""]);
    rows.push(["Reference No. & Date", referenceNumber || ""]);
    rows.push(["Other Reference", otherReference || ""]);
    rows.push(["Buyer's Order Number", buyersOrderNumber || ""]);
    rows.push(["Dated", dated || ""]);
    rows.push(["Dispatch Doc No.", dispatchDocNumber || ""]);
    rows.push(["Delivery Note Date", deliveryDateNote || ""]);
    rows.push(["Dispatched Through", dispatchThrough || ""]);
    rows.push(["Destination", destination || ""]);
    rows.push(["Terms of Delivery", termsOfDelivery || ""]);
    rows.push(["E-way Bill No.", ewayNumber || ""]);
    rows.push(["HSN/SAC", hsnSAC || ""]);
    rows.push([]); // blank row

    // --- Items ---
    rows.push([
      "Sl.No",
      "Description of Goods",
      "HSN/SAC",
      "Quantity",
      "Rate",
      "Amount",
    ]);
    addItems.forEach((item, index) => {
      rows.push([
        index + 1,
        item.descriptionOfGoods || "",
        hsnSAC || "",
        item.quantity || "",
        item.rate || "",
        item.amount || "",
      ]);
    });
    rows.push([]);

    // --- Totals ---
    rows.push(["Sub Total", "", "", "", "", subTotal.toFixed(2)]);

    if (!isNaN(Number(gstPercentage)) && gst) {
      rows.push([
        `CGST (${(Number(gstPercentage) / 2).toFixed(2)}%)`,
        "",
        "",
        "",
        "",
        (cGst ?? 0).toFixed(2),
      ]);
      rows.push([
        `SGST (${(Number(gstPercentage) / 2).toFixed(2)}%)`,
        "",
        "",
        "",
        "",
        (sGst ?? 0).toFixed(2),
      ]);
      rows.push([
        `Total GST @ ${Number(gstPercentage).toFixed(2)}%`,
        "",
        "",
        "",
        "",
        gstAmount.toFixed(2),
      ]);
    }

    rows.push(["Round Off", "", "", "", "", roundOff.toFixed(2)]);
    rows.push(["Grand Total", "", "", "", "", grandTotal.toFixed(2)]);

    // --- Convert to CSV string ---
    const csvContent = rows
      .map((row) => row.map((cell) => `"${cell ?? ""}"`).join(","))
      .join("\n");

    // --- Trigger Download ---
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `invoice_${invoiceNumber || "untitled"}.csv`;
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
