import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { BillContext } from "../Context/BillingContext";
import NumbertoWords from "../Components/NumbertoWords";
import { toast } from "react-toastify";

const BillEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { allBills, setAllBills, sellers } = useContext(BillContext);

  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bill = allBills.find((b) => b.id === id);
    if (bill) {
      setFormData({
        ...bill,
        seller: bill.seller || {},
        buyer: bill.buyer || {},
        consignee: bill.consignee || {},
        items: bill.items || [],
      });
      setLoading(false);
    } else {
      toast.error("Bill not found");
      navigate("/bills");
    }
  }, [allBills, id, navigate]);

  if (loading || !formData) return <p>Loading...</p>;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const dateObj = new Date(dateStr);
    const day = String(dateObj.getDate()).padStart(2, "0");
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleNestedChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], [field]: value },
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    
    // Auto-calculate amount if quantity or rate changes
    if (field === 'quantity' || field === 'rate') {
      const quantity = field === 'quantity' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].quantity) || 0;
      const rate = field === 'rate' ? parseFloat(value) || 0 : parseFloat(updatedItems[index].rate) || 0;
      updatedItems[index].amount = (quantity * rate).toFixed(2);
    }
    
    setFormData((prev) => ({ ...prev, items: updatedItems }));
    calculateTotals(updatedItems);
  };

  const calculateTotals = (items) => {
    const subTotal = items.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
    const gstAmount = formData.gst ? (subTotal * (parseFloat(formData.gstPercentage) || 0)) / 100 : 0;
    const cGst = gstAmount / 2;
    const sGst = gstAmount / 2;
    const totalBeforeRounding = subTotal + gstAmount;
    const grandTotal = Math.round(totalBeforeRounding);
    const roundOff = grandTotal - totalBeforeRounding;

    setFormData((prev) => ({
      ...prev,
      subTotal: subTotal.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      cGst: cGst.toFixed(2),
      sGst: sGst.toFixed(2),
      grandTotal: grandTotal.toFixed(2),
      roundOff: roundOff.toFixed(2),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!formData.invoiceNumber) {
      toast.error("Please enter invoice number");
      return;
    }
    if (!formData.buyer?.name) {
      toast.error("Please enter buyer name");
      return;
    }
    if (formData.items.length === 0) {
      toast.error("Please add at least one item");
      return;
    }

    // Update the bill
    const updatedBills = allBills.map((bill) => (bill.id === id ? formData : bill));
    setAllBills(updatedBills);
    localStorage.setItem("Bills", JSON.stringify(updatedBills));

    toast.success("Bill updated successfully!");
    navigate(`/bills/${id}`);
  };

  return (
    <div className="a4">
      <form onSubmit={handleSubmit}>
        {/* Header with Update Button */}
        <div className="flex justify-between items-center mb-4 no-print">
          <h1 className="text-2xl font-bold">Edit Invoice: {formData.invoiceNumber}</h1>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/bills/${id}`)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Bill
            </button>
          </div>
        </div>

        <div className="flex border border-b-0">
          <div className="flex flex-col w-3/5">
            {/* Seller Section (Read-only) */}
            <section className="border-b p-2">
              <div className="space-y-1 text-gray-700 text-sm font-medium">
                <p className="text-base">{formData.seller?.name}</p>
                <p>{formData.seller?.address}</p>
                <p><span>Phone:</span> {formData.seller?.phone}</p>
                <p><span>Email:</span> {formData.seller?.email}</p>
                {formData.gst && formData.seller?.gstin && (
                  <p><span>GSTIN/UIN:</span> {formData.seller.gstin}</p>
                )}
              </div>
            </section>

            {/* Buyer Section (Editable) */}
            <section className="border-b p-2 text-sm font-medium text-gray-700 space-y-1">
              <input
                type="text"
                value={formData.buyer?.name || ""}
                onChange={(e) => handleNestedChange("buyer", "name", e.target.value)}
                className="text-base font-medium border border-gray-300 rounded px-2 py-1 w-full"
                placeholder="Buyer Name"
                required
              />
              <textarea
                value={formData.buyer?.address || ""}
                onChange={(e) => handleNestedChange("buyer", "address", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
                rows="2"
                placeholder="Buyer Address"
              />
              <div>
                <span>Phone: </span>
                <input
                  type="tel"
                  value={formData.buyer?.phone || ""}
                  onChange={(e) => handleNestedChange("buyer", "phone", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-32"
                  placeholder="Phone"
                />
              </div>
              <div>
                <span>Email: </span>
                <input
                  type="email"
                  value={formData.buyer?.email || ""}
                  onChange={(e) => handleNestedChange("buyer", "email", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-48"
                  placeholder="Email"
                />
              </div>
              {formData.gst && (
                <div>
                  <span>GSTIN/UIN: </span>
                  <input
                    type="text"
                    value={formData.buyer?.gstin || ""}
                    onChange={(e) => handleNestedChange("buyer", "gstin", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-40"
                    placeholder="GSTIN"
                  />
                </div>
              )}
            </section>

            {/* Consignee Section (Editable) */}
            <section className="p-2 text-sm font-medium text-gray-700 space-y-1">
              <input
                type="text"
                value={formData.consignee?.name || ""}
                onChange={(e) => handleNestedChange("consignee", "name", e.target.value)}
                className="text-base font-medium border border-gray-300 rounded px-2 py-1 w-full"
                placeholder="Consignee Name"
              />
              <textarea
                value={formData.consignee?.address || ""}
                onChange={(e) => handleNestedChange("consignee", "address", e.target.value)}
                className="border border-gray-300 rounded px-2 py-1 w-full"
                rows="2"
                placeholder="Consignee Address"
              />
              <div>
                <span>Phone: </span>
                <input
                  type="tel"
                  value={formData.consignee?.phone || ""}
                  onChange={(e) => handleNestedChange("consignee", "phone", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-32"
                  placeholder="Phone"
                />
              </div>
              <div>
                <span>Email: </span>
                <input
                  type="email"
                  value={formData.consignee?.email || ""}
                  onChange={(e) => handleNestedChange("consignee", "email", e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 w-48"
                  placeholder="Email"
                />
              </div>
              {formData.gst && (
                <div>
                  <span>GSTIN/UIN: </span>
                  <input
                    type="text"
                    value={formData.consignee?.gstin || ""}
                    onChange={(e) => handleNestedChange("consignee", "gstin", e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 w-40"
                    placeholder="GSTIN"
                  />
                </div>
              )}
            </section>
          </div>

          {/* Right Side Invoice Details */}
          <div className="w-2/5 font-medium text-sm border-l">
            <table className="w-full">
              <tbody>
                <tr>
                  <td className="border-r border-b w-1/2 p-2">
                    <p>Invoice Number:</p>
                    <input
                      type="text"
                      value={formData.invoiceNumber || ""}
                      onChange={(e) => handleInputChange("invoiceNumber", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                      required
                    />
                  </td>
                  <td className="w-1/2 p-2 border-b">
                    <p>Date:</p>
                    <input
                      type="date"
                      value={formData.date || ""}
                      onChange={(e) => handleInputChange("date", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-b w-1/2 p-2">
                    <p>Delivery Note:</p>
                    <input
                      type="text"
                      value={formData.deliveryNote || ""}
                      onChange={(e) => handleInputChange("deliveryNote", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="w-1/2 border-b p-2">
                    <p>Mode/Terms of Payment:</p>
                    <input
                      type="text"
                      value={formData.modeAndTermsOfPayment || ""}
                      onChange={(e) => handleInputChange("modeAndTermsOfPayment", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-b w-1/2 p-2">
                    <p>Reference No. & Date:</p>
                    <input
                      type="text"
                      value={formData.referenceNumber || ""}
                      onChange={(e) => handleInputChange("referenceNumber", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="w-1/2 border-b p-2">
                    <p>Other Reference:</p>
                    <input
                      type="text"
                      value={formData.otherReference || ""}
                      onChange={(e) => handleInputChange("otherReference", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-b w-1/2 p-2">
                    <p>Buyer's Order No.:</p>
                    <input
                      type="text"
                      value={formData.buyersOrderNumber || ""}
                      onChange={(e) => handleInputChange("buyersOrderNumber", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="w-1/2 border-b p-2">
                    <p>Dated:</p>
                    <input
                      type="text"
                      value={formData.dated || ""}
                      onChange={(e) => handleInputChange("dated", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-b w-1/2 p-2">
                    <p>Dispatch Doc No.:</p>
                    <input
                      type="text"
                      value={formData.dispatchDocNumber || ""}
                      onChange={(e) => handleInputChange("dispatchDocNumber", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="w-1/2 border-b p-2">
                    <p>Delivery Note Date:</p>
                    <input
                      type="text"
                      value={formData.deliveryDateNote || ""}
                      onChange={(e) => handleInputChange("deliveryDateNote", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="border-r border-b w-1/2 p-2">
                    <p>Dispatched through:</p>
                    <input
                      type="text"
                      value={formData.dispatchThrough || ""}
                      onChange={(e) => handleInputChange("dispatchThrough", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                  <td className="w-1/2 border-b p-2">
                    <p>Destination:</p>
                    <input
                      type="text"
                      value={formData.destination || ""}
                      onChange={(e) => handleInputChange("destination", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="p-2" colSpan={2}>
                    <p>Terms of Delivery:</p>
                    <input
                      type="text"
                      value={formData.termsOfDelivery || ""}
                      onChange={(e) => handleInputChange("termsOfDelivery", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
                <tr>
                  <td className="p-2" colSpan={2}>
                    <p>e-way Bill No.:</p>
                    <input
                      type="text"
                      value={formData.ewayNumber || ""}
                      onChange={(e) => handleInputChange("ewayNumber", e.target.value)}
                      className="border border-gray-300 rounded px-2 py-1 w-full"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Items Table */}
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
              {formData.items?.map((item, index) => (
                <tr key={index} className="text-center text-sm font-medium">
                  <td className="border-r p-2">{index + 1}</td>
                  <td className="border-r p-2">
                    <input
                      type="text"
                      value={item.descriptionOfGoods || ""}
                      onChange={(e) => handleItemChange(index, "descriptionOfGoods", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="Item description"
                    />
                  </td>
                  <td className="border-r p-2">
                    <input
                      type="text"
                      value={formData.hsnSAC || ""}
                      onChange={(e) => handleInputChange("hsnSAC", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="HSN/SAC"
                    />
                  </td>
                  <td className="border-r p-2">
                    <input
                      type="number"
                      value={item.quantity || ""}
                      onChange={(e) => handleItemChange(index, "quantity", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="0"
                    />
                  </td>
                  <td className="border-r p-2">
                    <input
                      type="number"
                      value={item.rate || ""}
                      onChange={(e) => handleItemChange(index, "rate", e.target.value)}
                      className="w-full border border-gray-300 rounded px-2 py-1"
                      placeholder="0.00"
                      step="0.01"
                    />
                  </td>
                  <td className="border-r p-2">
                    <input
                      type="text"
                      value={item.amount || ""}
                      className="w-full border border-gray-300 rounded px-2 py-1 bg-gray-100"
                      readOnly
                    />
                  </td>
                </tr>
              ))}

              {[...Array(Math.max(16 - (formData.items?.length || 0), 0))].map((_, i) => (
                <tr key={`empty-${i}`} className="text-center text-sm font-medium">
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
              {formData.gst && (
                <>
                  <tr>
                    <td colSpan={5} className="border p-2 text-end">Sub Total</td>
                    <td className="border p-2 text-end">₹ {formData.subTotal || "0.00"}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border p-2 text-end">
                      CGST ({((formData.gstPercentage || 0) / 2).toFixed(2)}%)
                    </td>
                    <td className="border p-2 text-end">{formData.cGst || "0.00"}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border p-2 text-end">
                      SGST ({((formData.gstPercentage || 0) / 2).toFixed(2)}%)
                    </td>
                    <td className="border p-2 text-end">{formData.sGst || "0.00"}</td>
                  </tr>
                </>
              )}
              <tr>
                <td colSpan={5} className="border p-2 text-end">Round Off</td>
                <td className="border p-2 text-end">{formData.roundOff || "0.00"}</td>
              </tr>
              <tr>
                <td colSpan={5} className="border p-2 text-end">Grand Total</td>
                <td className="border p-2 text-end">₹ {formData.grandTotal || "0.00"}</td>
              </tr>
              <tr>
                <td colSpan={6} className="p-2">
                  <p>Amounts Chargeable (in words)</p>
                  <NumbertoWords number={formData.grandTotal || 0} />
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* GST Table and other sections remain the same as BillViewer */}
        {formData.gst && (
          <div className="">
            <table className="border border-t-0 w-full">
              <thead className="text-center text-sm font-medium border border-t-0">
                <tr>
                  <td rowSpan={2} className="p-2 border-r">HSN/SAC</td>
                  <td rowSpan={2} className="p-2 border-r">Taxable Value</td>
                  <td colSpan={2} className="p-2 border-r">CGST</td>
                  <td colSpan={2} className="p-2 border-r">SGST/UTGST</td>
                  <td rowSpan={2} className="p-2 border-r">Total Tax Amount</td>
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
                  <td className="border p-2">{formData.hsnSAC || ""}</td>
                  <td className="border p-2">{formData.subTotal || "0.00"}</td>
                  <td className="border p-2">{((formData.gstPercentage || 0) / 2).toFixed(2)}%</td>
                  <td className="border p-2">{formData.cGst || "0.00"}</td>
                  <td className="border p-2">{((formData.gstPercentage || 0) / 2).toFixed(2)}%</td>
                  <td className="border p-2">{formData.sGst || "0.00"}</td>
                  <td className="border p-2">{formData.gstAmount || "0.00"}</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={7} className="font-medium p-2">
                    <p>Tax Amount (in words)</p>
                    <NumbertoWords number={formData.gstAmount || 0} />
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        )}

        {/* Bank Details and Declaration sections remain the same */}
        <div className="w-full flex flex-col text-xs items-end border-x">
          <div className="w-1/2">
            <p>Company's Bank Details</p>
            <p>Bank Name: <strong>{formData.seller?.bankname || ""}</strong></p>
            <p>A/c No.: <strong>{formData.seller?.accno || ""}</strong></p>
            <p>Branch & IFS Code: <strong>{formData.seller?.branchifs || ""}</strong></p>
          </div>
        </div>

        {formData.gst && (
          <div className="border border-t-0 font-medium text-xs flex">
            <section className="p-2 w-1/2 border-r">
              <p className="underline">Declaration</p>
              <p>
                We declare that this invoice shows the actual price of the goods
                describe and all particulars are true and correct.// OD interest
                @ {formData.gstPercentage || 0}% p.a. chargeable for payments after due
                date.//GOODs once sold will not be taken back.//
              </p>
            </section>
            <section className="flex flex-col justify-between items-end text-xs border-t w-1/2 p-2">
              <p>for {formData.seller?.name || ""}</p>
              <p>Authorised Signatory</p>
            </section>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-between items-center w-full my-2 no-print">
          <Link to="/bills" className="w-[15%]">
            <button
              type="button"
              className="bg-gray-700 p-2 text-white font-medium text-sm rounded w-full hover:bg-gray-950 cursor-pointer"
            >
              Back to Bills
            </button>
          </Link>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => navigate(`/bills/${id}`)}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Update Bill
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BillEdit;