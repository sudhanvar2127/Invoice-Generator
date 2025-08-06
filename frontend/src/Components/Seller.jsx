import React, { useContext } from "react";
import { BillContext } from "../Context/BillingContext";

const Seller = () => {
  const { sellers, seller, setSeller, gst } = useContext(BillContext);

  const handleSellerChange = (index) => {
    setSeller(index);
  };

  return (
    <div className="flex flex-col space-y-4 w-full p-4 bg-white border-b">
      {sellers.map((item, index) => (
        <div
          key={index}
          className={`border rounded p-4 cursor-pointer transition-shadow ${
            seller === index ? " border-black" : "border-gray-300"
          }`}
        >
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={seller === index}
              onChange={() => handleSellerChange(index)}
              className="w-5 h-5 text-black border-gray-300 rounded focus:ring-black"
            />
            <span className="font-semibold text-gray-800">{item.name}</span>
          </label>

          {seller === index && (
            <div className="mt-3 space-y-1 text-gray-700 text-sm">
              <p>
                <span className="font-medium">Name:</span> {item.name}
              </p>
              <p>
                <span className="font-medium">Address:</span> {item.address}
              </p>
              <p>
                <span className="font-medium">Phone:</span> {item.phone}
              </p>
              <p>
                <span className="font-medium">Email:</span> {item.email}
              </p>
              {gst && (
                <p>
                  <span className="font-medium">GSTIN:</span> {item.gstin}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default Seller;
