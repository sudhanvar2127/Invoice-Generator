import React, { useContext, forwardRef } from "react";
import { BillContext } from "../Context/BillingContext";
import { Link } from "react-router-dom";
import NumbertoWords from "../Components/NumbertoWords";
import GenerateBill from "../Components/GenerateBill";

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
    nonGstSellerDetails,
    kindAttn,
    setKindAttn, // Added this
  } = useContext(BillContext);

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Safe seller details for non-GST mode
  const safeSellerDetails = nonGstSellerDetails || {
    name: "",
    address: "",
    phone: "",
    email: "",
    bankname: "",
    accno: "",
    branchifs: "",
  };

  return (
    <div className="a4">
      <h1 className="text-3xl text-center font-medium py-2">Tax Invoice</h1>
      <p className="text-sm text-center py-0.5 font-medium">
        Subject to Davanagere Jurisdction
      </p>
      <div className="flex border border-b-0">
        <div className="flex flex-col w-3/5">
          <section className="border-b p-2">
            {gst ? (
              // GST Mode - Show selected seller from sellers array
              sellers.map(
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
                      <p>
                        <span>GSTIN/UIN:</span> {item.gstin}
                      </p>
                    </div>
                  ),
              )
            ) : (
              // Non-GST Mode - Show nonGstSellerDetails
              <div className="space-y-1 text-gray-700 text-sm font-medium">
                <p className="text-base">{safeSellerDetails.name || ""}</p>
                <p>{safeSellerDetails.address || ""}</p>
                <p>
                  <span>Phone:</span> {safeSellerDetails.phone || ""}
                </p>
                <p>
                  <span>Email:</span> {safeSellerDetails.email || ""}
                </p>
              </div>
            )}
          </section>
          <section className="border-b p-2 text-sm font-medium space-y-1">
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
          <section className="p-2 text-sm font-medium space-y-1">
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
                  <p>Purchase No. & Date:</p>
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
                <td className="p-2 border-b" colSpan={2}>
                  <p>e-way Bill No.:</p>
                  {ewayNumber !== "" ? ewayNumber : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="p-2" colSpan={2}>
                  <p>Kind Attn:</p>
                  {kindAttn !== "" ? kindAttn : <p>&nbsp;</p>}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="itemtable">
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
                <td className="text-start border-r p-2">
                  {item.descriptionOfGoods}
                </td>
                <td className="border-r p-2">{hsnSAC}</td>
                <td className="border-r p-2">{item.quantity}</td>
                <td className="border-r p-2">{item.rate}</td>
                <td className="border-r p-2">{item.amount.toFixed(2)}</td>
              </tr>
            ))}

            {[...Array(Math.max(10 - addItems.length, 0))].map((_, i) => (
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
                  <td colSpan={5} className="border-t border-r p-2 text-end">
                    Sub Total
                  </td>
                  <td className="border-t p-2 text-end">
                    ₹ {subTotal.toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border-r p-2 text-end">
                    CGST ({(gstPercentage / 2).toFixed(2)}%)
                  </td>
                  <td className="p-2 text-end">{(cGst ?? 0).toFixed(2)}</td>
                </tr>
                <tr>
                  <td colSpan={5} className="border-r p-2 text-end">
                    SGST ({(gstPercentage / 2).toFixed(2)}%)
                  </td>
                  <td className="p-2 text-end">{(sGst ?? 0).toFixed(2)}</td>
                </tr>
              </>
            )}
            <tr>
              <td colSpan={5} className="border-r p-2 text-end">
                Round Off
              </td>
              <td className="p-2 text-end">{roundOff.toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={5} className="border-b border-r p-2 text-end">
                Grand Total
              </td>
              <td className="border-b p-2 text-end">
                ₹ {grandTotal.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td colSpan={6} className="p-2">
                <p>Amounts Chargeable (in words) INR</p>
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
                  Total Tax Amount
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

      <div className={`bill-footer-wrapper border border-t-0 ${addItems.length >= 11 ? 'force-page-break' : ''}`}>
        <div className="w-full flex flex-col text-xs items-end border-x">
          {gst
            ? // GST Mode - Show bank details from selected seller
              sellers.map(
                (item, index) =>
                  seller === index && (
                    <div key={index} className="w-1/2">
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
                  ),
              )
            : // Non-GST Mode - Show bank details from nonGstSellerDetails
              safeSellerDetails.bankname && (
                <div className="w-1/2">
                  <p>Company's Bank Details</p>
                  <p>
                    Bank Name: <strong>{safeSellerDetails.bankname}</strong>
                  </p>
                  <p>
                    A/c No.: <strong>{safeSellerDetails.accno}</strong>
                  </p>
                  <p>
                    Branch & IFS Code:{" "}
                    <strong>{safeSellerDetails.branchifs}</strong>
                  </p>
                </div>
              )}
        </div>

        {gst && (
          <>
            <div className="border border-t-0 font-medium text-xs flex">
              <section className="p-2 w-1/2 border-r">
                <p className="underline">Declaration</p>
                <p>
                  We declare that this invoice shows the actual price of the
                  goods describe and all particulars are true and correct.// OD
                  interest @ {gstPercentage}% p.a. chargeable for payments after
                  due date.//GOODs once sold will not be taken back.//
                </p>
              </section>
              <section className="flex flex-col justify-between items-end text-xs border-t w-1/2 p-2">
                {gst ? (
                  sellers.map(
                    (item, index) =>
                      seller === index && <p key={index}>for {item.name}</p>,
                  )
                ) : (
                  <p>for {safeSellerDetails.name}</p>
                )}
                <p>Authorised Signatory</p>
              </section>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-between items-center w-full my-2 no-print">
        <Link to="/" className="w-[15%]">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-full hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>
        <GenerateBill />
      </div>
    </div>
  );
};

export default Preview;
