import React, { use } from "react";
import { createContext, useState, useContext, useEffect } from "react";

export const BillContext = createContext();

const BillContextProvide = (props) => {
  const sellers = [
    {
      id: "SriKalpvrushaPrinters",
      name: "Sri Kalpvrusha Printers",
      phone: 9972799992,
      email: "sri.kalpvrushaprinters@gmail.com",
      address:
        "# 495/15, Bharath Poultry Form, Nittuvalli Road, Near R.V.V.S. ITI College, Davangere - 577004",
      gstin: "29ABSPH4496G1Z0",
      bankname: "Karanataka Grameena Bank",
      accno: 123456789,
      branchifs: "Karnataka Grameena Bank, Main Branch, PKGB0010590",
    },
    {
      id: "ShreeSharadaPrinters",
      name: "Shree Sharada Printers",
      phone: 9986788647,
      email: "sri.kalpvrushaprinters@gmail.com",
      address:
        "#4382/1 Suvidya 7th B main Road Swami Vivekananda Badavane, Behind Officers club, Davangere - 577004",
      gstin: "29AJCPN3953E1Z5",
      bankname: "Karanataka Grameena Bank",
      accno: 10590110000550,
      branchifs: "Karnataka Grameena Bank, Main Branch, PKGB0010590",
    },
  ];

  const [seller, setSeller] = useState(sellers[0]);
  const [gst, setGst] = useState(true);
  const [nonGstSellerDetails, setNonGstSellerDetails] = useState([
    {
      name: "",
      address: "",
      phone: "",
      email: "",
      bankname: "",
      accno: "",
      branchifs: "",
    },
  ]);
  const [buyer, setBuyer] = useState([
    {
      name: "",
      address: "",
      phone: "",
      gstin: "",
      email: "",
    },
  ]);
  const [consignee, setConsignee] = useState([
    {
      name: "",
      address: "",
      phone: "",
      gstin: "",
      email: "",
    },
  ]);
  const [date, setDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [invoiceNumber, setInvoiceNumber] = useState(() => {
    // Try reading saved invoice number
    const stored = localStorage.getItem("currentInvoiceNumber");
    if (stored) return stored;

    // If not found, generate a new one
    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;
    if (!localStorage.getItem(key)) {
      localStorage.setItem(key, "0");
    }
    const newNumber = `${fy}/001`;
    localStorage.setItem("currentInvoiceNumber", newNumber);
    return newNumber;
  });

  const [ewayNumber, setEwayNumber] = useState("");
  const [modeAndTermsOfPayment, setModeAndTremsOfPayment] = useState("");
  const [deliveryNote, setDeliveryNote] = useState("");
  const [referenceNumber, setReferenceNumber] = useState("");
  const [otherReference, setOtherReference] = useState("");
  const [buyersOrderNumber, setBuyersOrderNumber] = useState("");
  const [dated, setDated] = useState("");
  const [dispatchDocNumber, setDispatchDocNumber] = useState("");
  const [deliveryDateNote, setDeliveryDateNote] = useState("");
  const [dispatchThrough, setDispatchThrough] = useState("");
  const [destination, setDestination] = useState("");
  const [termsOfDelivery, setTermsOfDelivery] = useState("");
  const [addItems, setAddItems] = useState([]);
  const [descriptionOfGoods, setDescriptionOfGoods] = useState("");
  const [hsnSAC, setHSNSAC] = useState();
  const [quantity, setQuantity] = useState();
  const [rate, setRate] = useState();
  const [amount, setAmount] = useState();
  const [roundOff, setRoundOff] = useState(0);
  const [gstPercentage, setGstPrecentage] = useState();
  const [subTotal, setSubTotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [cGst, setCGST] = useState(0);
  const [sGst, setSGST] = useState(0);
  const [billData, setBillData] = useState(null);
  const [allBills, setAllBills] = useState(() => {
    return JSON.parse(localStorage.getItem("Bills")) || [];
  });

  function getFinancialYear() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();
    if (month >= 4) {
      return `${year}-${(year + 1).toString().slice(-2)}`;
    } else {
      return `${year - 1}-${year.toString().slice(-2)}`;
    }
  }

  function getNextInvoiceNumber() {
    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;
    let serial = parseInt(localStorage.getItem(key) || "0", 10);
    serial += 1;
    localStorage.setItem(key, serial);
    const nextNumber = `${fy}/${serial.toString().padStart(3, "0")}`;
    localStorage.setItem("currentInvoiceNumber", nextNumber);
    return nextNumber;
  }

  function resetInvoiceNumber() {
    const fy = getFinancialYear();
    const key = `inv-serial-${fy}`;

    // Reset serial number and current invoice
    localStorage.setItem(key, "0");
    const firstNumber = `${fy}/001`;
    localStorage.setItem("currentInvoiceNumber", firstNumber);

    setInvoiceNumber(firstNumber);

    toast.success(`Invoice number reset to ${firstNumber}!`);
    setShowConfirmReset(false);

    // 🔑 Remove the reload — not required anymore
    // window.location.reload();
  }

  useEffect(() => {
    const savedBills = JSON.parse(localStorage.getItem("Bills")) || [];
    if (savedBills.length > 0) {
      setBillData(savedBills[savedBills.length - 1]); // load last saved
    }
  }, []);

  // Inside BillContextProvide, before value = { ... }
  function clearAllBills() {
    localStorage.removeItem("Bills");
    setAllBills([]);
    setBillData(null);
  }

  useEffect(() => {
    if (invoiceNumber) {
      localStorage.setItem("currentInvoiceNumber", invoiceNumber);
    }
  }, [invoiceNumber]);

  const value = {
    sellers,
    seller,
    setSeller,
    gst,
    setGst,
    buyer,
    setBuyer,
    consignee,
    setConsignee,
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
    addItems,
    setAddItems,
    descriptionOfGoods,
    setDescriptionOfGoods,
    hsnSAC,
    setHSNSAC,
    quantity,
    setQuantity,
    rate,
    setRate,
    amount,
    setAmount,
    roundOff,
    setRoundOff,
    gstPercentage,
    setGstPrecentage,
    subTotal,
    setSubTotal,
    gstAmount,
    setGstAmount,
    grandTotal,
    setGrandTotal,
    cGst,
    setCGST,
    sGst,
    setSGST,
    getNextInvoiceNumber,
    billData,
    setBillData,
    allBills,
    setAllBills,
    nonGstSellerDetails,
    setNonGstSellerDetails,
    getFinancialYear,
    resetInvoiceNumber,
    getNextInvoiceNumber,
    clearAllBills,
  };

  return (
    <BillContext.Provider value={value}>{props.children}</BillContext.Provider>
  );
};

export default BillContextProvide;
