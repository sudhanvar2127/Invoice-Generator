import React from "react";
import { useContext, useEffect } from "react";
import { BillContext } from "../Context/BillingContext";

const OtherDetails = () => {
  const {
    gst,
    date,
    setDate,
    invoiceNumber,
    setInvoiceNumber,
    deliveryNote,
    setDeliveryNote,
    modeAndTermsOfPayment,
    setModeAndTremsOfPayment,
    referenceNumber,
    setReferenceNumber,
    otherReference,
    setOtherReference,
    buyersOrderNumber,
    setBuyersOrderNumber,
    dated,
    setDated,
    dispatchDocNumber,
    setDispatchDocNumber,
    deliveryDateNote,
    setDeliveryDateNote,
    ewayNumber,
    setEwayNumber,
    dispatchThrough,
    setDispatchThrough,
    destination,
    setDestination,
    termsOfDelivery,
    setTermsOfDelivery,
    hsnSAC,
    setHSNSAC
  } = useContext(BillContext);

  function getFinancialYear() {
    const now = new Date();
    const month = now.getMonth() + 1; // month is 0-indexed
    const year = now.getFullYear();
    if (month >= 4) {
      // From April to December, current year as start year
      return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      // From Jan to March, previous year as start year
      return `${year - 1}-${year.toString().slice(-2)}`;
    }
  }

  function getNextInvoiceNumber() {
    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;
    let serial = parseInt(localStorage.getItem(key) || "0", 10);
    serial += 1;
    localStorage.setItem(key, serial);
    // Pad with leading zerosx
    const serialStr = serial.toString().padStart(3, "0");
    return `${fy}/${serialStr}`;
  }

  useEffect(() => {
    if (gst) {
      const newInvoice = getNextInvoiceNumber();
      setInvoiceNumber(newInvoice);
    } else {
      setInvoiceNumber("");
    }
  }, [gst, setInvoiceNumber]);

  return (
    <div>
      <div className="flex">
        <div className="flex flex-col border-r gap-2 p-2 w-1/2">
          <label className="text-sm font-medium text-gray-900">
            Invoice Number:
          </label>
          {gst ? (
            <input
              type="text"
              value={invoiceNumber}
              readOnly
              className="border rounded p-1.5 bg-gray-200"
            />
          ) : (
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="border rounded p-1.5"
            />
          )}
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Delivery Note:
          </label>
          <input
            type="text"
            name="deliveryNote"
            value={deliveryNote}
            onChange={(e) => setDeliveryNote(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Reference No. & Date:
          </label>
          <input
            type="text"
            name="referenceNumber"
            value={referenceNumber}
            onChange={(e) => setReferenceNumber(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Buyer's Order No.:
          </label>
          <input
            type="number"
            name="buyersOrderNumber"
            value={buyersOrderNumber}
            onChange={(e) => setBuyersOrderNumber(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Dispatch Doc No.:
          </label>
          <input
            type="text"
            name="dispatchDocNumber"
            value={dispatchDocNumber}
            onChange={(e) => setDispatchDocNumber(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Dispatched through:
          </label>
          <input
            type="text"
            name="dispatchThrough"
            value={dispatchThrough}
            onChange={(e) => setDispatchThrough(e.target.value)}
            className="border rounded p-1.5"
          />
        </div>
        <div className="flex flex-col gap-2 p-2 w-1/2">
          <label className="text-sm font-medium text-gray-900">
            Invoice Date:
          </label>
          <input
            type="date"
            name="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Mode/Terms of Payment:
          </label>
          <input
            type="text"
            name="modeAndTermsOfPayment"
            value={modeAndTermsOfPayment}
            onChange={(e) => setModeAndTremsOfPayment(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Other References:
          </label>
          <input
            type="text"
            name="otherReference"
            value={otherReference}
            onChange={(e) => setOtherReference(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">Dated:</label>
          <input
            type="date"
            name="dated"
            value={dated}
            onChange={(e) => setDated(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Delivery Note Date:
          </label>
          <input
            type="date"
            name="modeAndTermsOfPayment"
            value={deliveryDateNote}
            onChange={(e) => setDeliveryDateNote(e.target.value)}
            className="border rounded p-1.5"
          />
          <hr className="mt-1" />
          <label className="text-sm font-medium text-gray-900">
            Destination:
          </label>
          <input
            type="text"
            name="modeAndTermsOfPayment"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="border rounded p-1.5"
          />
        </div>
      </div>
      <div className="flex flex-col w-full border-y p-2">
        <label className="text-sm font-medium text-gray-900">
          E-way Bill Number:
        </label>
        <input
          type="number"
          name="ewayNumber"
          value={ewayNumber}
          onChange={(e) => setEwayNumber(e.target.value)}
          className="border rounded p-1.5"
        />
        <hr className="my-2" />
        <label className="text-sm font-medium text-gray-900">
          Terms of Delivery:
        </label>
        <textarea
          type="text"
          name="termsOfDelivery"
          value={termsOfDelivery}
          onChange={(e) => setTermsOfDelivery(e.target.value)}
          className="border rounded p-1.5"
        />
        <label className="text-sm font-medium text-gray-900">
          HSN/SAC:
        </label>
        <input
          type="number"
          name="hsnSAC"
          value={hsnSAC}
          onChange={(e) => setHSNSAC(e.target.value)}
          className="border rounded p-1.5"
        />
      </div>
    </div>
  );
};

export default OtherDetails;
