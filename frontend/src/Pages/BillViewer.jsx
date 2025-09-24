import React, { useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { BillContext } from "../Context/BillingContext";
import NumbertoWords from "../Components/NumbertoWords";
import GenerateBill from "../Components/GenerateBill";

const BillViewer = () => {
  const { id } = useParams();
  const { allBills } = useContext(BillContext);
  const navigate = useNavigate();
  
  const bill = allBills.find(b => b.id === id);
  
  if (!bill) return <p>Bill not found.</p>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0"); // month is 0-indexed
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  return (
    <div className="a4">
      <div className="flex border border-b-0">
        <div className="flex flex-col w-3/5">
          <section className="border-b p-2">
            <div className="space-y-1 text-gray-700 text-sm font-medium">
              <p className="text-base">{bill.seller?.name || ""}</p>
              <p>{bill.seller?.address || ""}</p>
              <p>
                <span>Phone:</span> {bill.seller?.phone || ""}
              </p>
              <p>
                <span>Email:</span> {bill.seller?.email || ""}
              </p>
              {bill.gst && bill.seller?.gstin && (
                <p>
                  <span>GSTIN/UIN:</span> {bill.seller.gstin}
                </p>
              )}
            </div>
          </section>
          <section className="border-b p-2 text-sm font-medium text-gray-700 space-y-1">
            <p className="text-base">{bill.buyer?.name || ""}</p>
            <p>{bill.buyer?.address || ""}</p>
            <p>
              <span>Phone:</span> {bill.buyer?.phone || ""}
            </p>
            <p>
              <span>Email:</span> {bill.buyer?.email || ""}
            </p>
            {bill.gst && bill.buyer?.gstin && (
              <p>
                <span>GSTIN/UIN:</span> {bill.buyer.gstin}
              </p>
            )}
          </section>
          <section className="p-2 text-sm font-medium text-gray-700 space-y-1">
            <p className="text-base">{bill.consignee?.name || ""}</p>
            <p>{bill.consignee?.address || ""}</p>
            <p>
              <span>Phone:</span> {bill.consignee?.phone || ""}
            </p>
            <p>
              <span>Email:</span> {bill.consignee?.email || ""}
            </p>
            {bill.gst && bill.consignee?.gstin && (
              <p>
                <span>GSTIN/UIN:</span> {bill.consignee.gstin}
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
                  {bill.invoiceNumber !== "" && bill.invoiceNumber ? bill.invoiceNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 p-2 border-b">
                  <p>Date:</p>
                  {formatDate(bill.date) || <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Delivery Note:</p>
                  {bill.deliveryNote !== "" && bill.deliveryNote ? bill.deliveryNote : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Mode/Terms of Payment:</p>
                  {bill.modeAndTermsOfPayment !== "" && bill.modeAndTermsOfPayment ? (
                    bill.modeAndTermsOfPayment
                  ) : (
                    <p>&nbsp;</p>
                  )}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Reference No. & Date:</p>
                  {bill.referenceNumber !== "" && bill.referenceNumber ? bill.referenceNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Other Reference:</p>
                  {bill.otherReference !== "" && bill.otherReference ? bill.otherReference : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Buyer's Order No.:</p>
                  {bill.buyersOrderNumber !== "" && bill.buyersOrderNumber ? bill.buyersOrderNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Dated:</p>
                  {bill.dated !== "" && bill.dated ? bill.dated : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Dispatch Doc No.:</p>
                  {bill.dispatchDocNumber !== "" && bill.dispatchDocNumber ? bill.dispatchDocNumber : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Delivery Note Date:</p>
                  {bill.deliveryDateNote !== "" && bill.deliveryDateNote ? bill.deliveryDateNote : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="border-r border-b w-1/2 p-2">
                  <p>Dispatched through:</p>
                  {bill.dispatchThrough !== "" && bill.dispatchThrough ? bill.dispatchThrough : <p>&nbsp;</p>}
                </td>
                <td className="w-1/2 border-b p-2">
                  <p>Destination:</p>
                  {bill.destination !== "" && bill.destination ? bill.destination : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr className="border-b">
                <td className="p-2" colSpan={2}>
                  <p>Terms of Delivery:</p>
                  {bill.termsOfDelivery !== "" && bill.termsOfDelivery ? bill.termsOfDelivery : <p>&nbsp;</p>}
                </td>
              </tr>
              <tr>
                <td className="p-2" colSpan={2}>
                  <p>e-way Bill No.:</p>
                  {bill.ewayNumber !== "" && bill.ewayNumber ? bill.ewayNumber : <p>&nbsp;</p>}
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
            {bill.items?.map((item, index) => (
              <tr key={index} className="text-center text-sm font-medium">
                <td className="border-r p-2">{index + 1}</td>
                <td className="border-r p-2">{item.descriptionOfGoods || ""}</td>
                <td className="border-r p-2">{bill.hsnSAC || ""}</td>
                <td className="border-r p-2">{item.quantity || ""}</td>
                <td className="border-r p-2">{item.rate || ""}</td>
                <td className="border-r p-2">{item.amount || ""}</td>
              </tr>
            ))}

            {[...Array(Math.max(16 - (bill.items?.length || 0), 0))].map((_, i) => (
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
            {bill.gst && (
              <>
                <tr>
                  <td colSpan={5} className="border p-2 text-end">
                    Sub Total
                  </td>
                  <td className="border p-2 text-end">
                    ₹ {bill.subTotal?.toFixed(2) || "0.00"}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border p-2 text-end">
                    CGST ({((bill.gstPercentage || 0) / 2).toFixed(2)}%)
                  </td>
                  <td className="border p-2 text-end">
                    {(bill.cGst ?? 0).toFixed(2)}
                  </td>
                </tr>
                <tr>
                  <td colSpan={5} className="border p-2 text-end">
                    SGST ({((bill.gstPercentage || 0) / 2).toFixed(2)}%)
                  </td>
                  <td className="border p-2 text-end">
                    {(bill.sGst ?? 0).toFixed(2)}
                  </td>
                </tr>
              </>
            )}
            <tr>
              <td colSpan={5} className="border p-2 text-end">
                Round Off
              </td>
              <td className="border p-2 text-end">{bill.roundOff?.toFixed(2) || "0.00"}</td>
            </tr>
            <tr>
              <td colSpan={5} className="border p-2 text-end">
                Grand Total
              </td>
              <td className="border p-2 text-end">₹ {bill.grandTotal?.toFixed(2) || "0.00"}</td>
            </tr>
            <tr>
              <td colSpan={6} className="p-2">
                <p>Amounts Chargeable (in words)</p>
                <NumbertoWords number={bill.grandTotal || 0} />
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
      {bill.gst && (
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
                <td className="border p-2">{bill.hsnSAC || ""}</td>
                <td className="border p-2">{bill.subTotal?.toFixed(2) || "0.00"}</td>
                <td className="border p-2">
                  {((bill.gstPercentage || 0) / 2).toFixed(2)}%
                </td>
                <td className="border p-2">{(bill.cGst ?? 0).toFixed(2)}</td>
                <td className="border p-2">
                  {((bill.gstPercentage || 0) / 2).toFixed(2)}%
                </td>
                <td className="border p-2">{(bill.sGst ?? 0).toFixed(2)}</td>
                <td className="border p-2">{bill.gstAmount?.toFixed(2) || "0.00"}</td>
              </tr>
            </tbody>

            <tfoot>
              <tr>
                <td colSpan={7} className="font-medium p-2">
                  <p>Tax Amount (in words)</p>
                  <NumbertoWords number={bill.gstAmount || 0} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}

      <div className="w-full flex flex-col text-xs items-end border-x">
        <div className="w-1/2">
          <p>Company's Bank Details</p>
          <p>
            Bank Name: <strong>{bill.seller?.bankname || ""}</strong>
          </p>
          <p>
            A/c No.: <strong>{bill.seller?.accno || ""}</strong>
          </p>
          <p>
            Branch & IFS Code: <strong>{bill.seller?.branchifs || ""}</strong>
          </p>
        </div>
      </div>

      {bill.gst && (
        <>
          <div className="border border-t-0 font-medium text-xs flex">
            <section className="p-2 w-1/2 border-r">
              <p className="underline">Declaration</p>
              <p>
                We declare that this invoice shows the actual price of the goods
                describe and all particulars are true and correct.// OD interest
                @ {bill.gstPercentage || 0}% p.a. chargeable for payments after due
                date.//GOODs once sold will not be taken back.//
              </p>
            </section>
            <section className="flex flex-col justify-between items-end text-xs border-t w-1/2 p-2">
              <p>for {bill.seller?.name || ""}</p>
              <p>Authorised Signatory</p>
            </section>
          </div>
        </>
      )}

      <div className="flex justify-between items-center w-full my-2 no-print">
        <Link to="/bills" className="w-[15%]">
          <button className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-full hover:bg-gray-950 cursor-pointer">
            Back
          </button>
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => navigate(`/bills/${bill.id}/edit`)}
            className="bg-gray-600 p-2 text-white font-medium text-sm rounded hover:bg-gray-700 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => window.print()}
            className="bg-gray-700 p-2 text-white font-medium text-sm rounded hover:bg-gray-800 cursor-pointer"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillViewer;