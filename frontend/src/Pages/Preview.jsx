import React, { useContext, forwardRef } from "react";
import { BillContext } from "../Context/BillingContext";
import { Link } from "react-router-dom";
import NumbertoWords from "../Components/NumbertoWords";

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
          <section className="border-b p-2 text-sm font-medium text-gray-700 space-y-1">
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
          <section className="p-2 text-sm font-medium text-gray-700 space-y-1">
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
                  {date}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Delivery Note:</p>
                  {deliveryNote !== "" ? deliveryNote : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Mode/Terms of Payment:</p>
                  {modeAndTermsOfPayment !== "" ? modeAndTermsOfPayment : <p>&nbsp;</p>}
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
              <td className="border p-2">Description of Goods</td>
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
                <td className="border-r p-2">{item.hsnSAC}</td>
                <td className="border-r p-2">{item.quantity}</td>
                <td className="border-r p-2">{item.rate}</td>
                <td className="border-r p-2">{item.amount}</td>
              </tr>
            ))}

            {[...Array(5)].map((_, i) => (
              <tr
                key={`empty-${i}`}
                className="text-center text-sm font-medium"
              >
                <td className="border-r p-2">&nbsp;</td>
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
      <div className="flex justify-between items-center w-full my-2">
        <Link to="/" className="w-[15%]">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-full hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>
        <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-[20%] hover:bg-gray-950 cursor-pointer">
          Download Invoice
        </button>
      </div>
    </div>
  );
};

export default Preview;
