import React, { use } from "react";
import { createContext, useState, useContext } from "react";

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
      bankname: "Karanataka Gramina Bank",
      accno: 123456789,
      branchifs: "Hello, 123456789",
    },
    {
      id: "ShreeSharadaPrinters",
      name: "Shree Sharada Printers",
      phone: 9986788647,
      email: "sri.kalpvrushaprinters@gmail.com",
      address:
        "#4382/1 Suvidya 7th B main Road Swami Vivekananda Badavane, Behind Officers club, Davangere - 577004",
      gstin: "29ABSPH4496G1Z0",
      bankname: "Karanataka Gramina Bank",
      accno: 123456789,
      branchifs: "Hello, 123456789",
    }
  ];

  const [seller, setSeller] = useState(sellers[0]);
  const [gst, setGst] = useState(true);
  const [buyer, setBuyer] = useState([{
    name: "",
    address: "",
    phone: "",
    gstin: "",
    email: "",
  }]);
  const [consignee, setConsignee] = useState([{
    name: "",
    address: "",
    phone: "",
    gstin: "",
    email: "",
  }]);
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState("");
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
  const [subTotal,setSubTotal] = useState(0);
  const [gstAmount, setGstAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);
  const [cGst, setCGST] = useState(0);
  const [sGst, setSGST] = useState(0);

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
    setSGST
  };

  return (
    <BillContext.Provider value={value}>{props.children}</BillContext.Provider>
  );
};

export default BillContextProvide;