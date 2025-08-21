import React, { useContext, forwardRef } from "react";
import { BillContext } from "../Context/BillingContext";
import { Link } from "react-router-dom";
import NumbertoWords from "../Components/NumbertoWords";
import { toast } from "react-toastify";

const Preview = () => {
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
    <div className="a4">
      <div className="flex border border-b-0">
        <div className="flex flex-col w-3/5">
          <section className="border-b p-2">
            {sellers.map(
              (item, index) =>
                seller === index && (
                  <div
                    key={index}
                    className="space-y-1 text-gray-700 text-sm font-medium"
                  >
                    <p className="text-base">{item.name}</p>
                    <p>{item.address}</p>
                    <p>
                      <span>Phone:</span> {item.phone}
                    </p>
                    <p>
                      <span>Email:</span> {item.email}
                    </p>
                    {gst && (
                      <p>
                        <span>GSTIN/UIN:</span> {item.gstin}
                      </p>
                    )}
                  </div>
                )
            )}
          </section>
          <section className="border-b p-2 text-sm font-medium text-gray-700 space-y-1">
            <p className="text-base">{buyer.name}</p>
            <p>{buyer.address}</p>
            <p>
              <span>Phone:</span> {buyer.phone}
            </p>
            <p>
              <span>Email:</span> {buyer.email}
            </p>
            {gst && (
              <p>
                <span>GSTIN/UIN:</span> {buyer.gstin}
              </p>
            )}
          </section>
          <section className="p-2 text-sm font-medium text-gray-700 space-y-1">
            <p className="text-base">{consignee.name}</p>
            <p>{consignee.address}</p>
            <p>
              <span>Phone:</span> {consignee.phone}
            </p>
            <p>
              <span>Email:</span> {consignee.email}
            </p>
            {gst && (
              <p>
                <span>GSTIN/UIN:</span> {consignee.gstin}
              </p>
            )}
          </section>
        </div>
        <div className="w-2/5 font-medium text-sm border-l">
          <table className="w-full">
            <tbody className="">
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Invoice Number:</p>
                  {invoiceNumber !== "" ? invoiceNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 p-2 border-b">
                  <p>Date:</p>
                  {formatDate(date)}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Delivery Note:</p>
                  {deliveryNote !== "" ? deliveryNote : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Mode/Terms of Payment:</p>
                  {modeAndTermsOfPayment !== "" ? (
                    modeAndTermsOfPayment
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Reference No. & Date:</p>
                  {referenceNumber !== "" ? referenceNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Other Reference:</p>
                  {otherReference !== "" ? otherReference : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Buyer's Order No.:</p>
                  {buyersOrderNumber !== "" ? buyersOrderNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Dated:</p>
                  {dated !== "" ? dated : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Dispatch Doc No.:</p>
                  {dispatchDocNumber !== "" ? dispatchDocNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Delivery Note Date:</p>
                  {deliveryDateNote !== "" ? deliveryDateNote : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Dispatched through:</p>
                  {dispatchThrough !== "" ? dispatchThrough : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Destination:</p>
                  {destination !== "" ? destination : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2" colSpan={2}>
                  <p>Terms of Delivery:</p>
                  {termsOfDelivery !== "" ? termsOfDelivery : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="p-2" colSpan={2}>
                  <p>e-way Bill No.:</p>
                  {ewayNumber !== "" ? ewayNumber : <p>&nbsp;</p>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div>
        <table className="border w-full">
          <thead>
            <tr className="text-sm font-medium border text-center">
              <td className="border p-2">Sl.No</td>
              <td className="border p-2 w-3/5">Description of Goods</td>
              <td className="border p-2">HSN/SAC</td>
              <td className="border p-2">Quantity</td>
              <td className="border p-2">Rate</td>
              <td className="border p-2">Amount</td>
            </tr>
          </thead>

          <tbody>
            {addItems.map((item, index) => (
              <tr key={index} className="text-center text-sm font-medium">
                <td className="border-r p-2">{index + 1}</td>
                <td className="border-r p-2">{item.descriptionOfGoods}</td>
                <td className="border-r p-2">{hsnSAC}</td>
                <td className="border-r p-2">{item.quantity}</td>
                <td className="border-r p-2">{item.rate}</td>
                <td className="border-r p-2">{item.amount}</td>
              </tr>
            ))}

            {[...Array(Math.max(5 - addItems.length, 0))].map((_, i) => (
              <tr
                key={`empty-${i}`}
                className="text-center text-sm font-medium"
              >
                <td className="border-r p-2">&nbsp;</td>
                <td className="border-r p-2">&nbsp;</td>
                <td className="border-r p-2">&nbsp;</td>
                <td className="border-r p-2">&nbsp;</td>
                <td className="border-r p-2">&nbsp;</td>
              </tr>
            ))}
          </tbody>

          <tfoot className="text-sm font-medium">
            {gst && (
              <>
                <tr>
                  <td colSpan={5} className="border p-2 text-end">
                    Sub Total
                  </td>
                  <td className="border p-2 text-end">
                    ₹ {subTotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border p-2 text-end">
                    CGST ({(gstPercentage / 2).toFixed(2)}%)
                  </td>
                  <td className="border p-2 text-end">
                    {(cGst ?? 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border p-2 text-end">
                    SGST ({(gstPercentage / 2).toFixed(2)}%)
                  </td>
                  <td className="border p-2 text-end">
                    {(sGst ?? 0).toFixed(2)}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td colSpan={5} className="border p-2 text-end">
                Round Off
              </td>
              <td className="border p-2 text-end">{roundOff.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={5} className="border p-2 text-end">
                Grand Total
              </td>
              <td className="border p-2 text-end">₹ {grandTotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={6} className="p-2">
                <p>Amounts Chargeable (in words)</p>
                <NumbertoWords number={grandTotal} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {gst && (
        <div className="">
          <table className="border border-t-0 w-full">
            <thead className="text-center text-sm font-medium border border-t-0">
              <tr>
                <td rowSpan={2} className="p-2 border-r">
                  HSN/SAC
                </td>
                <td rowSpan={2} className="p-2 border-r">
                  Taxable Value
                </td>
                <td colSpan={2} className="p-2 border-r">
                  CGST
                </td>
                <td colSpan={2} className="p-2 border-r">
                  SGST/UTGST
                </td>
                <td rowSpan={2} className="p-2 border-r">
                  Total Tax Amout
                </td>
              </tr>
              <tr>
                <td className="border p-1">Rate</td>
                <td className="border p-1">Amount</td>
                <td className="border p-1">Rate</td>
                <td className="border p-1">Amount</td>
              </tr>
            </thead>

            <tbody>
              <tr className="text-center text-sm font-medium">
                <td className="border p-2">{hsnSAC}</td>
                <td className="border p-2">{subTotal.toFixed(2)}</td>
                <td className="border p-2">
                  {(gstPercentage / 2).toFixed(2)}%
                </td>
                <td className="border p-2">{(cGst ?? 0).toFixed(2)}</td>
                <td className="border p-2">
                  {(gstPercentage / 2).toFixed(2)}%
                </td>
                <td className="border p-2">{(sGst ?? 0).toFixed(2)}</td>
                <td className="border p-2">{gstAmount.toFixed(2)}</td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={7} className="font-medium p-2">
                  <p>Tax Amount (in words)</p>
                  <NumbertoWords number={gstAmount} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="w-full flex flex-col text-xs items-end border-x">
        {sellers.map(
          (item, index) =>
            seller === index && (
              <div className="w-1/2">
                <p>Company's Bank Details</p>
                <p>
                  Bank Name: <strong>{item.bankname}</strong>
                </p>
                <p>
                  A/c No.: <strong>{item.accno}</strong>
                </p>
                <p>
                  Branch & IFS Code: <strong>{item.branchifs}</strong>
                </p>
              </div>
            )
        )}
      </div>

      <div className="border border-t-0 font-medium text-xs flex">
        <section className="p-2 w-1/2 border-r">
          <p className="underline">Declaration</p>
          <p>
            We declare that this invoice shows the actual price of the goods
            describe and all particulars are true and correct.// OD interest @{" "}
            {gstPercentage}% p.a. chargeable for payments after due date.//GOODs
            once sold will not be taken back.//
          </p>
        </section>
        <section className="flex flex-col justify-between items-end text-xs border-t w-1/2 p-2">
          {sellers.map(
            (item, index) => seller === index && <p>for {item.name}</p>
          )}
          <p>Authorisec Signatory</p>
        </section>
      </div>

      <div className="flex justify-between items-center w-full my-2 no-print">
        <Link to="/" className="w-[15%]">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-full hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>
        <button
          type="button"
          onClick={handleDownloadInvoice}
          className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-[20%] hover:bg-gray-950 cursor-pointer"
        >
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Preview;
