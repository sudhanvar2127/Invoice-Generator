import React, { useEffect, useState } from "react";

const AllBills = () => {
  const [groupedBills, setGroupedBills] = useState({});

  useEffect(() => {
    const allBills = JSON.parse(localStorage.getItem("allBills")) || [];

    // Group by seller name → then subcategorise into GST / No GST
    const grouped = allBills.reduce((acc, bill) => {
      const sellerName = bill.seller?.name || "Unknown Seller";
      if (!acc[sellerName]) {
        acc[sellerName] = { withGst: [], withoutGst: [] };
      }
      if (bill.gst) {
        acc[sellerName].withGst.push(bill);
      } else {
        acc[sellerName].withoutGst.push(bill);
      }
      return acc;
    }, {});

    setGroupedBills(grouped);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Bills</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(groupedBills).map(([sellerName, { withGst, withoutGst }]) => (
          <div key={sellerName} className="border rounded-lg shadow-md p-4 bg-white">
            
            {/* Seller Category Box */}
            <h2 className="text-xl font-semibold border-b pb-2 mb-4">{sellerName}</h2>

            {/* Subcategory: With GST */}
            <div className="mb-4 p-3 border rounded bg-green-50">
              <h3 className="font-semibold text-green-700 mb-2">With GST</h3>
              {withGst.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {withGst.map((bill, i) => (
                    <li key={i}>
                      Invoice #{bill.invoiceNumber} — {bill.date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No GST bills</p>
              )}
            </div>

            {/* Subcategory: Without GST */}
            <div className="p-3 border rounded bg-yellow-50">
              <h3 className="font-semibold text-yellow-700 mb-2">Without GST</h3>
              {withoutGst.length > 0 ? (
                <ul className="list-disc list-inside text-sm">
                  {withoutGst.map((bill, i) => (
                    <li key={i}>
                      Invoice #{bill.invoiceNumber} — {bill.date}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm">No Non-GST bills</p>
              )}
            </div>

          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBills;