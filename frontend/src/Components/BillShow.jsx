import React from "react";
import { Link } from "react-router-dom";

const BillShow = ({ bill }) => {
  if (!bill) return null;

  return (
    <Link
      to={`/bills/${bill.id}`}
      className="block border rounded p-3 mb-3 bg-white hover:bg-gray-100 transition"
    >
      <div className="font-semibold text-lg">{bill.invoiceNumber || "-"}</div>
      <div className="text-sm text-gray-700">Seller: {bill.seller?.name || "-"}</div>
      <div className="text-sm text-gray-700">Buyer: {bill.buyer?.name || "-"}</div>
    </Link>
  );
};

export default BillShow;
