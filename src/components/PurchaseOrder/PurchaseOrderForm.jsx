// import React, { useEffect, useState, useRef } from "react";
// import { Search, Save } from "lucide-react";
// import styles from "./Purchase.module.css";
// import {
//   createPurchaseOrder,
//   fetchSupplierDetails,
// } from "../../services/db_manager";
// import Sidebar from "../Sidebar";
// import Header from "../Header";
// import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
// import Footer from "../Footer";
// import { toast } from "react-toastify";
// import { useLocation, useNavigate } from "react-router-dom"; // <-- For navigation

// export default function PurchaseOrderForm() {
//   const location = useLocation();
//   const { selectedItems } = location.state || { selectedItems: [] };

//   //console.log("Received selectedItems:", selectedItems);
//   const [batchNo, setBatchNo] = useState("");
//   // State for table data
//   const [tableData, setTableData] = useState([]);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [data, setData] = useState([]);

//   const navigate = useNavigate();
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const [filteredData, setFilteredData] = useState([]);
//   const dropdownRef = useRef(null);
//   const [formData, setFormData] = useState({
//     poNo: "",
//     poDate: "2025-04-26",
//     ourReference: "OR-12345",
//     yourReference: "YR-54321",
//     delivery: "Immediate",
//     supplierName: "",
//     //deliveryAddress:
//     //  "AMC TECHNOLOGY\n105, Hiday Industrial Estate, Hira Industrial Park\nOff Western Express Highway, Vasai Phata,\nVasai (East) Dist - Palghar, 401208",
//     //paymentTerms: "Net 30 Days",
//     items: [],
//     pf: 0,
//     transportation: 0,
//     insurance: 0,
//     other_Charges: 0,
//     incoterm: "FOB Mumbai",
//     currency: "",
//     forwarder: "BlueDart Logistics",
//   });

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const response = await fetchSupplierDetails(); // replace with actual API call
//         //console.log("Supplier Details",response.data);
//         if (Array.isArray(response.data)) {
//           setData(response.data);
//           setFilteredData(response);
//         } else {
//           setData([]);
//           setFilteredData([]);
//         }
//         setError(null);
//         //setData(response);
//         //setFilteredData(response);
//         setError(null);
//       } catch (err) {
//         console.error("API Error:", err);
//         setError("Failed to load supplier data. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleSearchChange = (e) => {
//     //console.log("Input typed:", e.target.value);
//     const value = e.target.value;
//     //console.log("Search input:", value);
//     setSearchTerm(value);
//     setIsDropdownOpen(true);

//     // If user clears the search, clear the form
//     if (!value) {
//       setFormData((prevForm) => ({
//         ...prevForm,
//         supplierName: "",
//         deliveryAddress: "",
//         paymentTerms: "",
//       }));
//     }
//   };

//   const handlePartSelection = (supplier) => {
//     setFormData((prevForm) => ({
//       ...prevForm,
//       supplierName: supplier.supplierName,
//       deliveryAddress: supplier.address,
//       paymentTerms: supplier.paymentTerms || "",
//     }));
//     setSearchTerm(supplier.supplierName);
//     setIsDropdownOpen(false);
//   };

//   // Filter data based on search term
//   useEffect(() => {
//     data.forEach((item) =>
//       console.log("Supplier Name:", `"${item.supplierName}"`)
//     );
//     if (data.length === 0) return;
//     if (searchTerm) {
//       console.log("searchTerm:", searchTerm);
//       const filtered = data.filter((item) =>
//         item.supplierName
//           .trim()
//           .toLowerCase()
//           .includes(searchTerm.trim().toLowerCase())
//       );
//       console.log("Filtered suppliers:", filtered); // 🔹

//       setFilteredData(filtered);
//     } else {
//       setFilteredData(data);
//     }
//   }, [searchTerm, data]);
//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   useEffect(() => {
//     if (selectedItems && selectedItems.length > 0) {
//       setFormData((prev) => ({
//         ...prev,
//         items: selectedItems.map((item) => ({
//           batchNumber: item.batchNumber,
//           id: item.id,
//           partNumber: item.partNumber,
//           description: item.description,
//           requiredQty: item.requiredQty,
//           units: item.unitOfMeasurement || "",
//           rate: item.rate || 0,
//           gross: calculateGross(item.requiredQty, item.rate || 0),
//         })),
//       }));

//       // Optional: If your batch number comes from these items
//       //setBatchNo(selectedItems[0].batchNo || "");
//     }
//   }, [selectedItems]);

//   const handleItemChange = (index, field, value) => {
//     let numValue = value;
//     if (field === "requiredQty" || field === "rate") {
//       numValue = parseFloat(value) || 0;
//       // Only allow positive values for requiredQty, but allow 0 for rate
//       if (field === "requiredQty" && numValue <= 0) return;
//     }

//     const updatedItems = [...formData.items];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: numValue,
//     };

//     if (field === "requiredQty" || field === "rate") {
//       updatedItems[index].gross = calculateGross(
//         field === "requiredQty" ? numValue : updatedItems[index].requiredQty,
//         field === "rate" ? numValue : updatedItems[index].rate
//       );
//     }

//     setFormData({
//       ...formData,
//       items: updatedItems,
//     });
//   };

//   const handleAdditionalChargeChange = (field, value) => {
//     let numValue = value === "" ? 0 : parseFloat(value);
//     // Only prevent negative values
//     if (numValue < 0) return;
//     setFormData({
//       ...formData,
//       [field]: numValue,
//     });
//   };

//   const handleInputChange = (field, value) => {
//     setFormData({
//       ...formData,
//       [field]: value,
//     });
//   };

//   const calculateGross = (qty, rate) => {
//     return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
//   };

//   const calculateSubtotal = () => {
//     return formData.items.reduce((sum, item) => sum + (item.gross || 0), 0);
//   };

//   const calculateTotal = () => {
//     return (
//       calculateSubtotal() +
//       formData.pf +
//       formData.transportation +
//       formData.insurance +
//       formData.other_Charges
//     );
//   };

//   const calculateTax = (rate) => {
//     return calculateTotal() * (rate / 100);
//   };

//   const calculateGrandTotal = () => {
//     // For this implementation, we'll use the provided tax rates
//     // SGST and CGST are both 9%, IGST can be 0% or 18% depending on state
//     const sgstAmount = calculateTax(9);
//     const cgstAmount = calculateTax(9);
//     const igstAmount = 0; // Set to 0 as per the example payload

//     return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
//   };

//   const handleSave = async () => {
//     try {
//       // If no items are loaded, show error
//       if (formData.items.length === 0) {
//         alert("Please search for a Po Number first to load items.");
//         return;
//       }

//       if (!formData.currency || formData.currency.trim() === "") {
//         toast.error("Select Currency");
//         return;
//       }

//       const itemsWithoutRate = formData.items.filter(
//         (item) => !item.rate || item.rate === 0
//       );
//       if (itemsWithoutRate.length > 0) {
//         toast.error("Rate is required for all items.");
//         return;
//       }

//       // Use the first item for the unit, rate and gross values
//       // as the new API expects single values instead of arrays
//       const firstItem = formData.items[0];

//       // Prepare the payload according to the new structure
//       const payload = {
//         // Required fields
//         poNumber: "",
//         batchNumber: formData.batchNumber,
//         // poNumber: formData.poNo,
//         poDate: formData.poDate,
//         ourReference: formData.ourReference,
//         yourReference: formData.yourReference,
//         delivery: formData.delivery,
//         deliveryAddress: formData.deliveryAddress,
//         paymentTerms: formData.paymentTerms,

//         // Use the first item's values as per the new API requirements
//         //unit: firstItem.units,
//         ratePerUnit: firstItem.rate,
//         grossAmount: calculateSubtotal(),

//         // Taxes & Totals
//         sgst: 9.0,
//         cgst: 9.0,
//         igst: 18.0,
//         total: calculateTotal(),
//         grandTotal: calculateGrandTotal(),

//         // Additional charges - using the new naming convention
//         pf: formData.pf,
//         transportation: formData.transportation,
//         other_Charges: formData.other_Charges,
//         insurance: formData.insurance,

//         // Other Info
//         termsAndConditions:
//           "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...",
//         incoterm: formData.incoterm,
//         currency: formData.currency,
//         forwarder: formData.forwarder,

//         items: formData.items.map((item) => ({
//           batchNumber: item.batchNumber,
//           id: item.id,
//           partNumber: item.partNumber,
//           description: item.description,
//           requiredQty: item.requiredQty,
//           units: item.units,
//           rate: item.rate,
//           gross: item.gross,
//         })),
//       };

//       // Call the API to save the data
//       const responce = await createPurchaseOrder(payload);
//       console.log("Save response:", responce);
//       if (responce.status !== 200) {
//         toast.error(
//           "Purchase order already saved or Error for saving Purchase Order."
//         );
//       } else {
//         setSearchTerm("");
//         setIsDropdownOpen(false);
//         toast.success("Purchase Order saved successfully!");
//         navigate("/purchaseOrder");
//       }
//       // alert("Purchase Order saved successfully!");
//     } catch (error) {
//       toast.error(
//         "Purchase order already saved or Error for saving Purchase Order."
//       );
//     }
//   };
//   return (
//     <>
//       <div className="wrapper">
//         <Sidebar />
//         <div className="content">
//           <Header />
//           <div style={{ marginTop: "10px" }}>
//             <CustomBreadcrumb
//               breadcrumbsLabel="Purchase Order"
//               // isBack={true}
//             />
//             <div className={styles.container}>
//               <div className={styles.formContainer}>
//                 {/* Close button */}
//                 <div className="d-flex justify-content-between align-items-center mb-3">
//                   <h4 className="mb-0">Generate Purchase Order {}</h4>
//                 </div>
//                 {/* Company Section */}
//                 <div className={styles.companySection}>
//                   <div className={styles.companyInfo}>
//                     <div className={styles.companyLogo}>
//                       <img
//                         src="/api/placeholder/100/50"
//                         alt="AMC Technology Logo"
//                         className={styles.logoImage}
//                       />
//                       <div>
//                         <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
//                         <p className={styles.companyAddress}>
//                           105, Hiday Industrial Estate, Hira Industrial Park
//                         </p>
//                         <p className={styles.companyAddress}>
//                           Off Western Express Highway, Vasai Phata,
//                         </p>
//                         <p className={styles.companyAddress}>
//                           Vasai (East) Dist - Palghar, 401208
//                         </p>
//                         <p className={styles.companyAddress}>
//                           GST NO: 27ABTPS4731Z1ZA
//                         </p>
//                       </div>
//                     </div>
//                   </div>
//                   <div className={styles.orderInfoSection}>
//                     <div className={styles.orderInfoGrid}>
//                       <div className={styles.orderInfoLabel}>P.O. Date:</div>
//                       <div>
//                         <input
//                           type="date"
//                           className={styles.inputField}
//                           value={formData.poDate}
//                           onChange={(e) =>
//                             handleInputChange("poDate", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className={styles.orderInfoLabel}>
//                         Our Reference:
//                       </div>
//                       <div>
//                         <input
//                           type="text"
//                           className={styles.inputField}
//                           value={formData.ourReference}
//                           onChange={(e) =>
//                             handleInputChange("ourReference", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className={styles.orderInfoLabel}>
//                         Your Reference:
//                       </div>
//                       <div>
//                         <input
//                           type="text"
//                           className={styles.inputField}
//                           value={formData.yourReference}
//                           onChange={(e) =>
//                             handleInputChange("yourReference", e.target.value)
//                           }
//                         />
//                       </div>
//                       <div className={styles.orderInfoLabel}>Delivery:</div>
//                       <div>
//                         <input
//                           type="text"
//                           className={styles.inputField}
//                           value={formData.delivery}
//                           onChange={(e) =>
//                             handleInputChange("delivery", e.target.value)
//                           }
//                         />
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Address Section */}
//                 <div className={styles.addressSection}>
//                   <div className={styles.addressBox}>
//                     <div className={styles.addressContainer}>
//                       <div className={styles.addressTitle}>To,</div>
//                       <div className={styles.addressText}>
//                         {loading ? (
//                           <div className="d-flex align-items-center">
//                             <div
//                               className="spinner-border text-primary me-2"
//                               role="status"
//                             >
//                               <span className="visually-hidden">
//                                 Loading...
//                               </span>
//                             </div>
//                             <span>Loading part numbers...</span>
//                           </div>
//                         ) : error ? (
//                           <div className="alert alert-danger w-100">
//                             {error}
//                           </div>
//                         ) : (
//                           <div
//                             className="w-100 position-relative"
//                             ref={dropdownRef}
//                           >
//                             <textarea
//                               className={styles.textareaField}
//                               placeholder="Search supplier ..."
//                               value={searchTerm}
//                               onChange={handleSearchChange}
//                               onFocus={() => setIsDropdownOpen(true)}
//                               required
//                               rows={1}
//                             />
//                             {isDropdownOpen && filteredData.length > 0 && (
//                               <div
//                                 className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg"
//                                 style={{
//                                   zIndex: 1000,
//                                   maxHeight: "200px",
//                                   overflowY: "auto",
//                                 }}
//                               >
//                                 {filteredData.map((supplier, index) => (
//                                   <div
//                                     key={index}
//                                     className="p-2 border-bottom cursor-pointer hover-bg-light"
//                                     style={{ cursor: "pointer" }}
//                                     onClick={() =>
//                                       handlePartSelection(supplier)
//                                     }
//                                     onMouseEnter={(e) =>
//                                       (e.target.style.backgroundColor =
//                                         "#f8f9fa")
//                                     }
//                                     onMouseLeave={(e) =>
//                                       (e.target.style.backgroundColor = "white")
//                                     }
//                                   >
//                                     <div className="fw-bold">
//                                       {supplier.supplierName}
//                                     </div>
//                                     <div className="text-muted small">
//                                       {supplier.address}
//                                     </div>
//                                   </div>
//                                 ))}
//                               </div>
//                             )}
//                           </div>
//                         )}
//                       </div>
//                       <div
//                         className="w-100 position-relative"
//                         ref={dropdownRef}
//                       >
//                         <textarea
//                           className={styles.textareaField}
//                           value={formData.deliveryAddress}
//                           required
//                           rows={2}
//                         />
//                       </div>
//                     </div>
//                   </div>
//                   <div className={styles.deliveryBox}>
//                     <div className={styles.addressContainer}>
//                       <div className={styles.addressTitle}>
//                         Delivery Address:
//                       </div>
//                       <div>
//                         <div className={styles.addressText}>
//                           <div>
//                             AMC TECHNOLOGY
//                             <br />
//                             105, Hiday Industrial Estate, Hira Industrial Park
//                             <br />
//                             Off Western Express Highway, Vasai Phata,
//                             <br />
//                             Vasai (East) Dist - Palghar, 401208
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Payment Terms */}
//                 <div className={styles.paymentTerms}>
//                   <div className={styles.paymentContainer}>
//                     <div className={styles.paymentTitle}>Payment Terms:</div>
//                     <div className={styles.paymentText}>
//                       <input
//                         type="text"
//                         className={styles.inputField}
//                         value={formData.paymentTerms}
//                         onChange={(e) =>
//                           handleInputChange("paymentTerms", e.target.value)
//                         }
//                         style={{ width: "100%" }}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Items Table */}
//                 <div className={styles.tableContainer}>
//                   <table className={styles.table}>
//                     <thead>
//                       <tr className={styles.tableHead}>
//                         {/* <th className={styles.tableHeader}>PR_No</th> */}
//                         <th className={styles.tableHeader}>P_REQ_No</th>
//                         <th className={styles.tableHeader}>Part Number</th>
//                         <th className={styles.tableHeader}>Description</th>
//                         <th className={styles.tableHeaderCenter}>QTY</th>
//                         <th className={styles.tableHeaderCenter}>Units</th>
//                         <th className={styles.tableHeaderCenter}>Rate/Unit</th>
//                         <th className={styles.tableHeaderCenter}>Gross</th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {formData.items.length > 0
//                         ? formData.items.map((item, index) => (
//                             <tr key={index}>
//                               {/* <td className={styles.tableCell}>{item.batchNumber}</td> */}
//                               <td className={styles.tableCell}>{item.id}</td>
//                               <td className={styles.tableCell}>
//                                 {item.partNumber}
//                               </td>
//                               <td className={styles.tableCell}>
//                                 {item.description}
//                               </td>
//                               <td className={styles.tableCellCenter}>
//                                 {item.requiredQty}
//                               </td>
//                               <td className={styles.tableCellCenter}>
//                                 <input
//                                   type="text"
//                                   className={styles.inputField}
//                                   value={item.units}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       index,
//                                       "units",
//                                       e.target.value
//                                     )
//                                   }
//                                 />
//                               </td>
//                               <td className={styles.tableCellCenter}>
//                                 <input
//                                   type="number"
//                                   min="1"
//                                   className={styles.inputField}
//                                   value={item.rate === 0 ? "" : item.rate}
//                                   onChange={(e) =>
//                                     handleItemChange(
//                                       index,
//                                       "rate",
//                                       e.target.value === "" ? 0 : e.target.value
//                                     )
//                                   }
//                                 />
//                               </td>
//                               <td className={styles.tableCellCenter}>
//                                 {(item.gross || 0).toFixed(2)}
//                               </td>
//                             </tr>
//                           ))
//                         : // Empty rows when no items are present
//                           Array(5)
//                             .fill(0)
//                             .map((_, index) => (
//                               <tr key={index}>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                                 <td className={styles.tableCell}>&nbsp;</td>
//                               </tr>
//                             ))}
//                     </tbody>
//                   </table>
//                 </div>

//                 {/* Footer Section */}
//                 <div className={styles.footerSection}>
//                   <div className={styles.footerLeft}>
//                     <div className={styles.legalText}>
//                       <div className={styles.legalTitle}>
//                         JURISDICTION OF COURTS:
//                       </div>
//                       <p>
//                         All contracts shall be deemed to have been wholly made
//                         in Mumbai and all claims thereunder are payable in
//                         Mumbai City and it is the distinct condition of the
//                         order that no suit or action for the purpose of
//                         enforcing any claim in respect of the order shall be
//                         instituted in any Court other than that situated in
//                         Mumbai City, Maharashtra State, India i.e. courts in
//                         Mumbai shall alone have jurisdiction to decide upon any
//                         dispute arising out of or in Respect of the contract.
//                       </p>
//                     </div>
//                     <div className={styles.termsSection}>
//                       <div className={styles.termsTitle}>
//                         TERMS AND CONDITION:
//                       </div>
//                       <div className={styles.termsGrid}>
//                         <div>Incoterm:</div>
//                         <div>
//                           <input
//                             type="text"
//                             className={styles.inputField}
//                             value={formData.incoterm}
//                             onChange={(e) =>
//                               handleInputChange("incoterm", e.target.value)
//                             }
//                           />
//                         </div>
//                         <div>Currency:</div>
//                         <div>
//                           <select
//                             className={styles.inputField}
//                             value={formData.currency}
//                             onChange={(e) =>
//                               handleInputChange("currency", e.target.value)
//                             }
//                           >
//                             <option value="">Select Currency</option>
//                             <option value="USD">USD</option>
//                             <option value="GBP">GBP</option>
//                             <option value="EURO">EURO</option>
//                             <option value="INR">INR</option>
//                           </select>
//                         </div>
//                         <div>Forwarder:</div>
//                         <div>
//                           <input
//                             type="text"
//                             className={styles.inputField}
//                             value={formData.forwarder}
//                             onChange={(e) =>
//                               handleInputChange("forwarder", e.target.value)
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                   <div className={styles.totalSection}>
//                     <table className={styles.totalTable}>
//                       <tbody>
//                         <tr>
//                           <td className={styles.totalLabel}>Gross</td>
//                           <td className={styles.totalValue}>
//                             {formData.items.length > 0
//                               ? calculateSubtotal().toFixed(2)
//                               : ""}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>P&F</td>
//                           <td className={styles.totalValue}>
//                             <input
//                               type="number"
//                               min="0"
//                               className={styles.inputField}
//                               value={formData.pf === 0 ? "" : formData.pf}
//                               onFocus={(e) => {
//                                 if (formData.pf === 0)
//                                   handleAdditionalChargeChange("pf", "");
//                               }}
//                               onChange={(e) =>
//                                 handleAdditionalChargeChange(
//                                   "pf",
//                                   e.target.value === "" ? 0 : e.target.value
//                                 )
//                               }
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>Transportation</td>
//                           <td className={styles.totalValue}>
//                             <input
//                               type="number"
//                               min="0"
//                               className={styles.inputField}
//                               value={
//                                 formData.transportation === 0
//                                   ? ""
//                                   : formData.transportation
//                               }
//                               onFocus={(e) => {
//                                 if (formData.transportation === 0)
//                                   handleAdditionalChargeChange(
//                                     "transportation",
//                                     ""
//                                   );
//                               }}
//                               onChange={(e) =>
//                                 handleAdditionalChargeChange(
//                                   "transportation",
//                                   e.target.value === "" ? 0 : e.target.value
//                                 )
//                               }
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>Insurance</td>
//                           <td className={styles.totalValue}>
//                             <input
//                               type="number"
//                               min="0"
//                               className={styles.inputField}
//                               value={
//                                 formData.insurance === 0
//                                   ? ""
//                                   : formData.insurance
//                               }
//                               onFocus={(e) => {
//                                 if (formData.insurance === 0)
//                                   handleAdditionalChargeChange("insurance", "");
//                               }}
//                               onChange={(e) =>
//                                 handleAdditionalChargeChange(
//                                   "insurance",
//                                   e.target.value === "" ? 0 : e.target.value
//                                 )
//                               }
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>Other Charges</td>
//                           <td className={styles.totalValue}>
//                             <input
//                               type="number"
//                               min="0"
//                               className={styles.inputField}
//                               value={
//                                 formData.other_Charges === 0
//                                   ? ""
//                                   : formData.other_Charges
//                               }
//                               onFocus={(e) => {
//                                 if (formData.other_Charges === 0)
//                                   handleAdditionalChargeChange(
//                                     "other_Charges",
//                                     ""
//                                   );
//                               }}
//                               onChange={(e) =>
//                                 handleAdditionalChargeChange(
//                                   "other_Charges",
//                                   e.target.value === "" ? 0 : e.target.value
//                                 )
//                               }
//                             />
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>Total</td>
//                           <td className={styles.totalValue}>
//                             {formData.items.length > 0
//                               ? calculateTotal().toFixed(2)
//                               : ""}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>SGST @ 9%</td>
//                           <td className={styles.totalValue}>
//                             {formData.items.length > 0
//                               ? calculateTax(9).toFixed(2)
//                               : ""}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>CGST @ 9%</td>
//                           <td className={styles.totalValue}>
//                             {formData.items.length > 0
//                               ? calculateTax(9).toFixed(2)
//                               : ""}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>IGST @ 18%</td>
//                           <td className={styles.totalValue}>
//                             {formData.items.length > 0
//                               ? calculateTax(18).toFixed(2)
//                               : ""}
//                             {/* Set to 0 as per example */}
//                           </td>
//                         </tr>
//                         <tr>
//                           <td className={styles.totalLabel}>Grand Total</td>
//                           <td className={styles.totalValue}>
//                             {formData.items.length > 0
//                               ? calculateGrandTotal().toFixed(2)
//                               : ""}
//                           </td>
//                         </tr>
//                       </tbody>
//                     </table>
//                   </div>
//                 </div>
//                 <div className={styles.signature}>
//                   <h6>FOR AMC TECHNOLOGY Authorised Signatory</h6>
//                   <div className={styles.formFooter}>
//                     <h6>Form: AMC-32 Rev:00 Date: Jan 2021</h6>
//                   </div>
//                 </div>

//                 {/* Form Footer */}

//                 {/* Save Button */}
//                 <div className={styles.saveButtonContainer}>
//                   <button onClick={handleSave} className={styles.saveButton}>
//                     <Save size={18} className={styles.saveIcon} />
//                     Save Purchase Order
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//         <Footer />
//       </div>
//     </>
//   );
// }
import { useEffect, useState, useRef } from "react";
import { Save } from "lucide-react";
import styles from "./Purchase.module.css";
import {
  createPurchaseOrder,
  fetchSupplierDetails,
} from "../../services/db_manager";
import Sidebar from "../Sidebar";
import Header from "../Header";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import Footer from "../Footer";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom"; // <-- For navigation

export default function PurchaseOrderForm() {
  const location = useLocation();
  const { selectedItems } = location.state || { selectedItems: [] };
  // State for table data
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState([]);

  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredData, setFilteredData] = useState([]);
  const dropdownRef = useRef(null);
  const [formData, setFormData] = useState({
    poNo: "",
    poDate: "",
    ourReference: "",
    yourReference: "",
    delivery: "",
    supplierName: "",
    address:
      "AMC TECHNOLOGY 105, Hiday Industrial Estate, Hira Industrial Park Off Western Express Highway, Vasai Phata,Vasai (East) Dist - Palghar, 401208",
    //deliveryAddress:
    //  "AMC TECHNOLOGY\n105, Hiday Industrial Estate, Hira Industrial Park\nOff Western Express Highway, Vasai Phata,\nVasai (East) Dist - Palghar, 401208",
    //paymentTerms: "Net 30 Days",
    items: [],
    pf: 0,
    transportation: 0,
    insurance: 0,
    other_Charges: 0,
    incoterm: "FOB Mumbai",
    currency: "",
    forwarder: "BlueDart Logistics",
    sgstRate: 0,
    cgstRate: 0,
    igstRate: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetchSupplierDetails(); // replace with actual API call
        //console.log("Supplier Details",response.data);
        if (Array.isArray(response.data)) {
          setData(response.data);
          setFilteredData(response);
        } else {
          setData([]);
          setFilteredData([]);
        }
        setError(null);
        //setData(response);
        //setFilteredData(response);
        setError(null);
      } catch (err) {
        console.error("API Error:", err);
        setError("Failed to load supplier data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearchChange = (e) => {
    //console.log("Input typed:", e.target.value);
    const value = e.target.value;
    //console.log("Search input:", value);
    setSearchTerm(value);
    setIsDropdownOpen(true);

    // If user clears the search, clear the form
    if (!value) {
      setFormData((prevForm) => ({
        ...prevForm,
        supplierName: "",
        deliveryAddress: "",
        paymentTerms: "",
      }));
    }
  };

  const handlePartSelection = (supplier) => {
    setFormData((prevForm) => ({
      ...prevForm,
      supplierName: supplier.supplierName,
      deliveryAddress: supplier.address,
      paymentTerms: supplier.paymentTerms || "",
    }));
    setSearchTerm(supplier.supplierName);
    setIsDropdownOpen(false);
  };

  // Filter data based on search term
  useEffect(() => {
    data.forEach((item) =>
      console.log("Supplier Name:", `"${item.supplierName}"`)
    );
    if (data.length === 0) return;
    if (searchTerm) {
      const filtered = data.filter((item) =>
        item.supplierName
          .trim()
          .toLowerCase()
          .includes(searchTerm.trim().toLowerCase())
      );
      setFilteredData(filtered);
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedItems && selectedItems.length > 0) {
      setFormData((prev) => ({
        ...prev,
        items: selectedItems.map((item) => ({
          batchNumber: item.batchNumber,
          id: item.id,
          partNumber: item.partNumber,
          description: item.description,
          requiredQty: item.requiredQty,
          units: item.unitOfMeasurement || "",
          rate: item.rate || 0,
          gross: calculateGross(item.requiredQty, item.rate || 0),
        })),
      }));

      // Optional: If your batch number comes from these items
      //setBatchNo(selectedItems[0].batchNo || "");
    }
  }, [selectedItems]);

  const handleItemChange = (index, field, value) => {
    let numValue = value;
    if (field === "requiredQty" || field === "rate") {
      numValue = parseFloat(value) || 0;
      // Only allow positive values for requiredQty, but allow 0 for rate
      if (field === "requiredQty" && numValue <= 0) return;
    }

    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: numValue,
    };

    if (field === "requiredQty" || field === "rate") {
      updatedItems[index].gross = calculateGross(
        field === "requiredQty" ? numValue : updatedItems[index].requiredQty,
        field === "rate" ? numValue : updatedItems[index].rate
      );
    }

    setFormData({
      ...formData,
      items: updatedItems,
    });
  };

  const handleAdditionalChargeChange = (field, value) => {
    let numValue = value === "" ? 0 : parseFloat(value);
    // Only prevent negative values
    if (numValue < 0) return;
    setFormData({
      ...formData,
      [field]: numValue,
    });
  };

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleGstRateChange = (field, value) => {
    let numValue = value === "" ? 0 : parseFloat(value);
    // Only prevent negative values and values over 100
    if (numValue < 0 || numValue > 100) return;
    setFormData({
      ...formData,
      [field]: numValue,
    });
  };

  const calculateGross = (qty, rate) => {
    return (parseFloat(qty) || 0) * (parseFloat(rate) || 0);
  };

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + (item.gross || 0), 0);
  };

  const calculateTotal = () => {
    return (
      calculateSubtotal() +
      formData.pf +
      formData.transportation +
      formData.insurance +
      formData.other_Charges
    );
  };

  const calculateTax = (rate) => {
    return calculateTotal() * (rate / 100);
  };

  const calculateGrandTotal = () => {
    // Only calculate GST if currency is INR
    if (formData.currency === "INR") {
      const sgstAmount = calculateTax(formData.sgstRate);
      const cgstAmount = calculateTax(formData.cgstRate);
      const igstAmount = calculateTax(formData.igstRate);

      return calculateTotal() + sgstAmount + cgstAmount + igstAmount;
    }

    // For other currencies, grand total equals total
    return calculateTotal();
  };

  // const handleSave = async () => {
  //   try {
  //     // If no items are loaded, show error
  //     if (formData.items.length === 0) {
  //       alert("Please search for a Po Number first to load items.");
  //       return;
  //     }

  //     if (!formData.currency || formData.currency.trim() === "") {
  //       toast.error("Select Currency");
  //       return;
  //     }

  //     const itemsWithoutRate = formData.items.filter(
  //       (item) => !item.rate || item.rate === 0
  //     );
  //     if (itemsWithoutRate.length > 0) {
  //       toast.error("Rate is required for all items.");
  //       return;
  //     }

  //     // Use the first item for the unit, rate and gross values
  //     // as the new API expects single values instead of arrays
  //     const firstItem = formData.items[0];

  //     // Prepare the payload according to the new structure
  //     const payload = {
  //       // Required fields
  //       poNumber: "",
  //       batchNumber: formData.batchNumber,
  //       // poNumber: formData.poNo,
  //       poDate: formData.poDate,
  //       ourReference: formData.ourReference,
  //       yourReference: formData.yourReference,
  //       delivery: formData.delivery,
  //       deliveryAddress: formData.deliveryAddress,
  //       paymentTerms: formData.paymentTerms,

  //       // Use the first item's values as per the new API requirements
  //       //unit: firstItem.units,
  //       ratePerUnit: firstItem.rate,
  //       grossAmount: calculateSubtotal(),

  //       // Taxes & Totals - Use dynamic values if INR, otherwise 0
  //       sgst: formData.currency === "INR" ? formData.sgstRate : 0,
  //       cgst: formData.currency === "INR" ? formData.cgstRate : 0,
  //       igst: formData.currency === "INR" ? formData.igstRate : 0,
  //       total: calculateTotal(),
  //       grandTotal: calculateGrandTotal(),

  //       // Additional charges - using the new naming convention
  //       pf: formData.pf,
  //       transportation: formData.transportation,
  //       other_Charges: formData.other_Charges,
  //       insurance: formData.insurance,
  //       address: formData.address,
  //       // Other Info
  //       termsAndConditions:
  //         "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...",
  //       incoterm: formData.incoterm,
  //       currency: formData.currency,
  //       forwarder: formData.forwarder,

  //       items: formData.items.map((item) => ({
  //         batchNumber: item.batchNumber,
  //         id: item.id,
  //         partNumber: item.partNumber,
  //         description: item.description,
  //         requiredQty: item.requiredQty,
  //         units: item.units,
  //         rate: item.rate,
  //         gross: item.gross,
  //       })),
  //     };

  //     // Call the API to save the data
  //     const responce = await createPurchaseOrder(payload);
  //     console.log("Save response:", responce);
  //     if (responce.status !== 200) {
  //       toast.error(
  //         "Purchase order already saved or Error for saving Purchase Order."
  //       );
  //     } else {
  //       setSearchTerm("");
  //       setIsDropdownOpen(false);
  //       toast.success("Purchase Order saved successfully!");
  //       navigate("/purchaseOrder");
  //     }
  //     // alert("Purchase Order saved successfully!");
  //   } catch (error) {
  //     toast.error(
  //       "Purchase order already saved or Error for saving Purchase Order."
  //     );
  //   }
  // };
  const handleSave = async () => {
    try {
      // If no items are loaded, show error
      if (formData.items.length === 0) {
        alert("Please search for a Po Number first to load items.");
        return;
      }

      if (!formData.currency || formData.currency.trim() === "") {
        toast.error("Select Currency");
        return;
      }
      if (!formData.deliveryAddress) {
        toast.error("Select delivery address.");
        return;
      }
      const itemsWithoutRate = formData.items.filter(
        (item) => !item.rate || item.rate === 0
      );
      if (itemsWithoutRate.length > 0) {
        toast.error("Rate is required for all items.");
        return;
      }

      // Use the first item for the unit, rate and gross values
      const firstItem = formData.items[0];

      // Calculate tax amounts (only if INR)
      const sgstAmount =
        formData.currency === "INR" ? calculateTax(formData.sgstRate) : 0;
      const cgstAmount =
        formData.currency === "INR" ? calculateTax(formData.cgstRate) : 0;
      const igstAmount =
        formData.currency === "INR" ? calculateTax(formData.igstRate) : 0;

      // Calculate totals
      const subtotal = calculateSubtotal();
      const total = calculateTotal();
      const grandTotal = calculateGrandTotal();

      // Prepare the payload according to the new structure
      const payload = {
        // Required fields
        poNumber: "",
        batchNumber: formData.batchNumber,
        poDate: formData.poDate,
        ourReference: formData.ourReference,
        yourReference: formData.yourReference,
        delivery: formData.delivery,
        deliveryAddress: formData.deliveryAddress,
        paymentTerms: formData.paymentTerms,

        // Use the first item's values as per the API requirements
        ratePerUnit: firstItem.rate,
        grossAmount: subtotal,

        // Taxes & Totals
        // Tax amounts (calculated values, 0 if not INR)
        sgst: sgstAmount,
        cgst: cgstAmount,
        igst: igstAmount,

        // Tax percentages (0 if not INR)
        sgstPercentage:
          formData.currency === "INR" ? parseFloat(formData.sgstRate) || 0 : 0,
        cgstPercentage:
          formData.currency === "INR" ? parseFloat(formData.cgstRate) || 0 : 0,
        igstPercentage:
          formData.currency === "INR" ? parseFloat(formData.igstRate) || 0 : 0,

        total: total,
        grandTotal: grandTotal,

        // Additional charges
        pf: formData.pf,
        transportation: formData.transportation,
        other_Charges: formData.other_Charges,
        insurance: formData.insurance,
        address: formData.address,

        // Other Info
        termsAndConditions:
          "All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City...",
        incoterm: formData.incoterm,
        currency: formData.currency,
        forwarder: formData.forwarder,

        items: formData.items.map((item) => ({
          batchNumber: item.batchNumber,
          id: item.id,
          partNumber: item.partNumber,
          description: item.description,
          requiredQty: item.requiredQty,
          units: item.units,
          rate: item.rate,
          gross: item.gross,
        })),
      };
      // Call the API to save the data
      const responce = await createPurchaseOrder(payload);
      console.log("Save response:", responce);
      if (responce.status !== 200) {
        toast.error(
          "Purchase order already saved or Error for saving Purchase Order."
        );
      } else {
        setSearchTerm("");
        setIsDropdownOpen(false);
        toast.success("Purchase Order saved successfully!");
        navigate("/purchaseOrder");
      }
    } catch (error) {
      toast.error(
        "Purchase order already saved or Error for saving Purchase Order."
      );
    }
  };
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toISOString().split("T")[0]; // Format: YYYY-MM-DD
    setFormData((prev) => ({
      ...prev,
      poDate: formattedDate,
    }));
  }, []);
  return (
    <>
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb
              breadcrumbsLabel="Purchase Order"
              // isBack={true}
            />
            <div className={styles.container}>
              <div className={styles.formContainer}>
                {/* Close button */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="mb-0">Generate Purchase Order {}</h4>
                </div>
                {/* Company Section */}
                <div className={styles.companySection}>
                  <div className={styles.companyInfo}>
                    <div className={styles.companyLogo}>
                      <img
                        src="/api/placeholder/100/50"
                        alt="AMC Technology Logo"
                        className={styles.logoImage}
                      />
                      <div>
                        <h2 className={styles.companyName}>AMC TECHNOLOGY</h2>
                        <p className={styles.companyAddress}>
                          105, Hiday Industrial Estate, Hira Industrial Park
                        </p>
                        <p className={styles.companyAddress}>
                          Off Western Express Highway, Vasai Phata,
                        </p>
                        <p className={styles.companyAddress}>
                          Vasai (East) Dist - Palghar, 401208
                        </p>
                        <p className={styles.companyAddress}>
                          GST NO: 27ABTPS4731Z1ZA
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.orderInfoSection}>
                    <div className={styles.orderInfoGrid}>
                      <div className={styles.orderInfoLabel}>P.O. Date:</div>
                      <div>
                        <input
                          type="date"
                          className={styles.inputField}
                          value={formData.poDate}
                          onChange={(e) =>
                            handleInputChange("poDate", e.target.value)
                          }
                          disabled
                        />
                      </div>
                      <div className={styles.orderInfoLabel}>
                        Our Reference:
                      </div>
                      <div>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={formData.ourReference}
                          onChange={(e) =>
                            handleInputChange("ourReference", e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.orderInfoLabel}>
                        Your Reference:
                      </div>
                      <div>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={formData.yourReference}
                          onChange={(e) =>
                            handleInputChange("yourReference", e.target.value)
                          }
                        />
                      </div>
                      <div className={styles.orderInfoLabel}>Delivery:</div>
                      <div>
                        <input
                          type="text"
                          className={styles.inputField}
                          value={formData.delivery}
                          onChange={(e) =>
                            handleInputChange("delivery", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Address Section */}
                <div className={styles.addressSection}>
                  <div className={styles.addressBox}>
                    <div className={styles.addressContainer}>
                      <div className={styles.addressTitle}>To,</div>
                      <div className={styles.addressText}>
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border text-primary me-2"
                              role="status"
                            >
                              <span className="visually-hidden">
                                Loading...
                              </span>
                            </div>
                            <span>Loading part numbers...</span>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger w-100">
                            {error}
                          </div>
                        ) : (
                          <div
                            className="w-100 position-relative"
                            ref={dropdownRef}
                          >
                            <textarea
                              className={styles.textareaField}
                              placeholder="Search supplier ..."
                              value={searchTerm}
                              onChange={handleSearchChange}
                              onFocus={() => setIsDropdownOpen(true)}
                              required
                              rows={1}
                            />
                            {isDropdownOpen && filteredData.length > 0 && (
                              <div
                                className="position-absolute w-100 bg-white border border-top-0 rounded-bottom shadow-lg"
                                style={{
                                  zIndex: 1000,
                                  maxHeight: "200px",
                                  overflowY: "auto",
                                }}
                              >
                                {filteredData.map((supplier, index) => (
                                  <div
                                    key={index}
                                    className="p-2 border-bottom cursor-pointer hover-bg-light"
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                      handlePartSelection(supplier)
                                    }
                                    onMouseEnter={(e) =>
                                      (e.target.style.backgroundColor =
                                        "#f8f9fa")
                                    }
                                    onMouseLeave={(e) =>
                                      (e.target.style.backgroundColor = "white")
                                    }
                                  >
                                    <div className="fw-bold">
                                      {supplier.supplierName}
                                    </div>
                                    <div className="text-muted small">
                                      {supplier.address}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div
                        className="w-100 position-relative"
                        ref={dropdownRef}
                      >
                        <textarea
                          className={styles.textareaField}
                          value={formData.deliveryAddress}
                          required
                          rows={2}
                          disabled
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.deliveryBox}>
                    <div className={styles.addressContainer}>
                      <div className={styles.addressTitle}>Address:</div>
                      <div>
                        <div className={styles.addressText}>
                          <textarea
                            className={styles.textareaField}
                            value={formData.address}
                            onChange={(e) =>
                              handleInputChange("address", e.target.value)
                            }
                            rows={4}
                            placeholder="Enter address..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Terms */}
                <div className={styles.paymentTerms}>
                  <div className={styles.paymentContainer}>
                    <div className={styles.paymentTitle}>Payment Terms:</div>
                    <div className={styles.paymentText}>
                      <input
                        type="text"
                        className={styles.inputField}
                        value={formData.paymentTerms}
                        onChange={(e) =>
                          handleInputChange("paymentTerms", e.target.value)
                        }
                        style={{ width: "100%" }}
                        disabled
                      />
                    </div>
                  </div>
                </div>

                {/* Items Table */}
                <div className={styles.tableContainer}>
                  <table className={styles.table}>
                    <thead>
                      <tr className={styles.tableHead}>
                        {/* <th className={styles.tableHeader}>PR_No</th> */}
                        <th className={styles.tableHeader}>P_REQ_No</th>
                        <th className={styles.tableHeader}>Part Number</th>
                        <th className={styles.tableHeader}>Description</th>
                        <th className={styles.tableHeaderCenter}>QTY</th>
                        <th className={styles.tableHeaderCenter}>Units</th>
                        <th className={styles.tableHeaderCenter}>Rate/Unit</th>
                        <th className={styles.tableHeaderCenter}>Gross</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.length > 0
                        ? formData.items.map((item, index) => (
                            <tr key={index}>
                              {/* <td className={styles.tableCell}>{item.batchNumber}</td> */}
                              <td className={styles.tableCell}>{item.id}</td>
                              <td className={styles.tableCell}>
                                {item.partNumber}
                              </td>
                              <td className={styles.tableCell}>
                                {item.description}
                              </td>
                              <td className={styles.tableCellCenter}>
                                {item.requiredQty}
                              </td>
                              <td className={styles.tableCellCenter}>
                                <input
                                  type="text"
                                  className={styles.inputField}
                                  value={item.units}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "units",
                                      e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className={styles.tableCellCenter}>
                                <input
                                  type="number"
                                  min="1"
                                  onWheel={(e) => e.target.blur()}
                                  className={styles.inputField}
                                  value={item.rate === 0 ? "" : item.rate}
                                  onChange={(e) =>
                                    handleItemChange(
                                      index,
                                      "rate",
                                      e.target.value === "" ? 0 : e.target.value
                                    )
                                  }
                                />
                              </td>
                              <td className={styles.tableCellCenter}>
                                {(item.gross || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))
                        : // Empty rows when no items are present
                          Array(5)
                            .fill(0)
                            .map((_, index) => (
                              <tr key={index}>
                                <td className={styles.tableCell}>&nbsp;</td>
                                <td className={styles.tableCell}>&nbsp;</td>
                                <td className={styles.tableCell}>&nbsp;</td>
                                <td className={styles.tableCell}>&nbsp;</td>
                                <td className={styles.tableCell}>&nbsp;</td>
                                <td className={styles.tableCell}>&nbsp;</td>
                                <td className={styles.tableCell}>&nbsp;</td>
                              </tr>
                            ))}
                    </tbody>
                  </table>
                </div>

                {/* Footer Section */}
                <div className={styles.footerSection}>
                  <div className={styles.footerLeft}>
                    <div className={styles.legalText}>
                      <div className={styles.legalTitle}>
                        JURISDICTION OF COURTS:
                      </div>
                      <p>
                        All contracts shall be deemed to have been wholly made
                        in Mumbai and all claims thereunder are payable in
                        Mumbai City and it is the distinct condition of the
                        order that no suit or action for the purpose of
                        enforcing any claim in respect of the order shall be
                        instituted in any Court other than that situated in
                        Mumbai City, Maharashtra State, India i.e. courts in
                        Mumbai shall alone have jurisdiction to decide upon any
                        dispute arising out of or in Respect of the contract.
                      </p>
                    </div>
                    <div className={styles.termsSection}>
                      <div className={styles.termsTitle}>
                        TERMS AND CONDITION:
                      </div>
                      <div className={styles.termsGrid}>
                        <div>Incoterm:</div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.incoterm}
                            onChange={(e) =>
                              handleInputChange("incoterm", e.target.value)
                            }
                          />
                        </div>
                        <div>Currency:</div>
                        <div>
                          <select
                            className={styles.inputField}
                            value={formData.currency}
                            onChange={(e) =>
                              handleInputChange("currency", e.target.value)
                            }
                          >
                            <option value="">Select Currency</option>
                            <option value="USD">USD</option>
                            <option value="GBP">GBP</option>
                            <option value="EURO">EURO</option>
                            <option value="INR">INR</option>
                          </select>
                        </div>
                        <div>Forwarder:</div>
                        <div>
                          <input
                            type="text"
                            className={styles.inputField}
                            value={formData.forwarder}
                            onChange={(e) =>
                              handleInputChange("forwarder", e.target.value)
                            }
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={styles.totalSection}>
                    <table className={styles.totalTable}>
                      <tbody>
                        <tr>
                          <td className={styles.totalLabel}>Gross</td>
                          <td className={styles.totalValue}>
                            {formData.items.length > 0
                              ? calculateSubtotal().toFixed(2)
                              : ""}
                          </td>
                        </tr>
                        {/* <tr>
                          <td className={styles.totalLabel}>P&F</td>
                          <td className={styles.totalValue}>
                            <input
                              type="number"
                              min="0"
                              onWheel={(e) => e.target.blur()}
                              className={styles.inputField}
                              value={formData.pf === 0 ? "" : formData.pf}
                              onFocus={(e) => {
                                if (formData.pf === 0)
                                  handleAdditionalChargeChange("pf", "");
                              }}
                              onChange={(e) =>
                                handleAdditionalChargeChange(
                                  "pf",
                                  e.target.value === "" ? 0 : e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className={styles.totalLabel}>Transportation</td>
                          <td className={styles.totalValue}>
                            <input
                              type="number"
                              min="0"
                              onWheel={(e) => e.target.blur()}
                              className={styles.inputField}
                              value={
                                formData.transportation === 0
                                  ? ""
                                  : formData.transportation
                              }
                              onFocus={(e) => {
                                if (formData.transportation === 0)
                                  handleAdditionalChargeChange(
                                    "transportation",
                                    ""
                                  );
                              }}
                              onChange={(e) =>
                                handleAdditionalChargeChange(
                                  "transportation",
                                  e.target.value === "" ? 0 : e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className={styles.totalLabel}>Insurance</td>
                          <td className={styles.totalValue}>
                            <input
                              type="number"
                              min="0"
                              className={styles.inputField}
                              value={
                                formData.insurance === 0
                                  ? ""
                                  : formData.insurance
                              }
                              onFocus={(e) => {
                                if (formData.insurance === 0)
                                  handleAdditionalChargeChange("insurance", "");
                              }}
                              onChange={(e) =>
                                handleAdditionalChargeChange(
                                  "insurance",
                                  e.target.value === "" ? 0 : e.target.value
                                )
                              }
                            />
                          </td>
                        </tr>
                        <tr>
                          <td className={styles.totalLabel}>Other Charges</td>
                          <td className={styles.totalValue}>
                            <input
                              type="number"
                              min="0"
                              onWheel={(e) => e.target.blur()}
                              className={styles.inputField}
                              value={
                                formData.other_Charges === 0
                                  ? ""
                                  : formData.other_Charges
                              }
                              onFocus={(e) => {
                                if (formData.other_Charges === 0)
                                  handleAdditionalChargeChange(
                                    "other_Charges",
                                    ""
                                  );
                              }}
                              onChange={(e) =>
                                handleAdditionalChargeChange(
                                  "other_Charges",
                                  e.target.value === "" ? 0 : e.target.value
                                )
                              }
                            />
                          </td>
                        </tr> */}
                        <tr>
                          <td className={styles.totalLabel}>Total</td>
                          <td className={styles.totalValue}>
                            {formData.items.length > 0
                              ? calculateTotal().toFixed(2)
                              : ""}
                          </td>
                        </tr>
                        {/* Conditionally render GST fields only when currency is INR */}
                        {formData.currency === "INR" && (
                          <>
                            <tr>
                              <td className={styles.totalLabel}>
                                <span>SGST @ </span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className={styles.inputField}
                                  value={
                                    formData.sgstRate === 0
                                      ? ""
                                      : formData.sgstRate
                                  }
                                  onChange={(e) =>
                                    handleGstRateChange(
                                      "sgstRate",
                                      e.target.value === "" ? 0 : e.target.value
                                    )
                                  }
                                  style={{
                                    width: "60px",
                                    display: "inline-block",
                                    marginLeft: "5px",
                                  }}
                                />
                                <span>%</span>
                              </td>
                              <td className={styles.totalValue}>
                                {formData.items.length > 0
                                  ? calculateTax(formData.sgstRate).toFixed(2)
                                  : ""}
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.totalLabel}>
                                <span>CGST @ </span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className={styles.inputField}
                                  value={
                                    formData.cgstRate === 0
                                      ? ""
                                      : formData.cgstRate
                                  }
                                  onChange={(e) =>
                                    handleGstRateChange(
                                      "cgstRate",
                                      e.target.value === "" ? 0 : e.target.value
                                    )
                                  }
                                  style={{
                                    width: "60px",
                                    display: "inline-block",
                                    marginLeft: "5px",
                                  }}
                                />
                                <span>%</span>
                              </td>
                              <td className={styles.totalValue}>
                                {formData.items.length > 0
                                  ? calculateTax(formData.cgstRate).toFixed(2)
                                  : ""}
                              </td>
                            </tr>
                            <tr>
                              <td className={styles.totalLabel}>
                                <span>IGST @ </span>
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  step="0.01"
                                  className={styles.inputField}
                                  value={
                                    formData.igstRate === 0
                                      ? ""
                                      : formData.igstRate
                                  }
                                  onChange={(e) =>
                                    handleGstRateChange(
                                      "igstRate",
                                      e.target.value === "" ? 0 : e.target.value
                                    )
                                  }
                                  style={{
                                    width: "60px",
                                    display: "inline-block",
                                    marginLeft: "5px",
                                  }}
                                />
                                <span>%</span>
                              </td>
                              <td className={styles.totalValue}>
                                {formData.items.length > 0
                                  ? calculateTax(formData.igstRate).toFixed(2)
                                  : ""}
                              </td>
                            </tr>
                          </>
                        )}
                        <tr>
                          <td className={styles.totalLabel}>Grand Total</td>
                          <td className={styles.totalValue}>
                            {formData.items.length > 0
                              ? calculateGrandTotal().toFixed(2)
                              : ""}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className={styles.signature}>
                  <h6>FOR AMC TECHNOLOGY Authorised Signatory</h6>
                  <div className={styles.formFooter}>
                    <h6>Form: AMC-32 Rev:00 Date: Jan 2021</h6>
                  </div>
                </div>

                {/* Form Footer */}

                {/* Save Button */}
                <div className={styles.saveButtonContainer}>
                  <button onClick={handleSave} className={styles.saveButton}>
                    <Save size={18} className={styles.saveIcon} />
                    Save Purchase Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}
