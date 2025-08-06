import React from "react";
import { useContext } from "react";
import { BillContext } from "../Context/BillingContext";
import { Link } from "react-router-dom";

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
  } = useContext(BillContext);

  return (
    <div>
      <div className="flex border">
        <div className="flex flex-col w-3/5">
          <section className="border-b border-r p-2">
            {sellers.map(
              (item, index) =>
                seller === index && (
                  <div className="space-y-1 text-gray-700 text-sm font-medium">
                    <p className="text-xl">{item.name}</p>
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
          <section className="border-b border-r p-2 text-sm font-medium text-gray-700 space-y-1">
            <p className="text-xl">{buyer.name}</p>
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
          <section className="border-r p-2 text-sm font-medium text-gray-700 space-y-1">
            <p className="text-xl">{consignee.name}</p>
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
        <div className="w-2/5 font-medium text-sm">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Invoice Number:</p>
                  {invoiceNumber}
                </td>
                <td className="w-1/2 p-2 border-b">
                  <p>Date:</p>
                  {date}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Delivery Note:</p>
                  {deliveryNote}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Mode/Terms of Payment:</p>
                  {modeAndTermsOfPayment}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Reference No. & Date:</p>
                  {referenceNumber}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Other Reference:</p>
                  {otherReference}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Buyer's Order No.:</p>
                  {buyersOrderNumber}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Dated:</p>
                  {dated}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Dispatch Doc No.:</p>
                  {dispatchDocNumber}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Delivery Note Date:</p>
                  {deliveryDateNote}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Dispatched through:</p>
                  {dispatchThrough}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Destination:</p>
                  {destination}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2">
                  <p>Terms of Delivery:</p>
                  {termsOfDelivery}
                </td>
              </tr>
              <tr>
                <td className="p-2">
                  <p>e-way Bill No.:</p>
                  {ewayNumber}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="">

      </div>
      <div className="">
        
      </div>
      <div className="flex justify-between items-center w-full my-2">
        <Link to="/" className="w-[15%]">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-full hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>
        <button className="bg-gray-700  p-2 text-white font-medium text-sm rounded w-[20%] hover:bg-gray-950 cursor-pointer">
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Preview;