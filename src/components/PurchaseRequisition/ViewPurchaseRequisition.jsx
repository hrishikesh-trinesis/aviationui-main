import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import { deletePurchaseRequisition, DownloadCSV, DownloadPDF, getPurchaseRequisitionDetail, listAllPurchaseRequisition } from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
// import styles from "./ViewPurchaseRequisition.module.css";

const ViewPurchaseRequisitionPage = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("purchaseRequisitionNo");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();

  const fetchData = async () => {
    setIsLoading(false)
    try {
      const response = await listAllPurchaseRequisition();
      setTableData(response || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching purchase requisitions", error);
      toast.error("Failed to load purchase requisitions");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Delete the selected purchase requisition
  const deleteSelectedElement = async (purchaseRequisitionID) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deletePurchaseRequisition(purchaseRequisitionID);
        setTableData((prevData) =>
          prevData.filter(
            (requisition) =>
              requisition.purchaseRequisitionID !== purchaseRequisitionID
          )
        );
        toast.success("Purchase requisition deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete purchase requisition", error);
        toast.error("Failed to delete purchase requisition. Please try again.");
      }
    }
  };

  // Edit the selected purchase requisition
  const editSelectedElement = async (RequisitionID) => {
    console.log(RequisitionID,"id paraent")
    navigate("/editpurchaserequisition", {
      state: { RequisitionID },
    });
  };

  // Search functionality
  const filteredData = tableData.filter((requisition) => {
    return Object.values(requisition).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Sorting functionality
  const sortedData = [...filteredData].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortDirection === "asc") {
      return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    } else {
      return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
    }
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxPageButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);

    if (endPage - startPage + 1 < maxPageButtons) {
      startPage = Math.max(1, endPage - maxPageButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageNumbers;
  };

  // Column definitions for the table
  const columns = [
    { field: "srNo", label: "Sr No", width: "50px" },
    { field: "partNumber", label: "Part Number", width: "130px" },
    { field: "description", label: "Description", width: "130px" },
    { field: "currentStock", label: "Current Stock", width: "150px" },
    { field: "requiredQty", label: "Required Qty", width: "130px" },
    { field: "requiredDate", label: "Required Date", width: "150px" },
    { field: "remark", label: "Remark", width: "100px" },
    { field: "batchnumber", label: "Batch Number", width: "150px"},
    { field: "unitOfMeasurement", label: "Unit of Measurement", width: "150px" }
  ];

  // const handlePrintClick = () => {
  //   setTimeout(() => {
  //     window.print();
  //   }, 500);
  // };
  const handleDownloadCSV = async () => {
    try {
      const response = await DownloadCSV()
      if(!response.error){
        toast.success("CSV file download successfully.!")
      }
      // Create a URL from the file
      // const url = window.URL.createObjectURL(response.data);
      console.log(response,"urllll")

      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'data.csv');
      // document.body.appendChild(link);
      // link.click();

      // // Clean up
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error downloading the CSV file');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await DownloadPDF()
      if(!response.error){
        toast.success("PDF file download successfully .!")
      }
      // const url = window.URL.createObjectURL(new Blob([response.data]));
      // console.log(url,"urllll")
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', 'data.pdf'); // File name
      // document.body.appendChild(link);
      // link.click();
      // link.parentNode.removeChild(link);
      // window.URL.revokeObjectURL(url);
    } catch (error) {
      toast.error('Error downloading PDF');
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Purchase Requisitions" />
          {/* <div className="printView">
            <PurchaseRequisitionForm tableData={tableData} />
          </div> */}
          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
            //   styles.normalViewStyle,
            ].join(" ")}
          >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search requisitions..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-3" style={{ display: 'flex', justifyContent: 'space-around' }}>
                  <button
                    onClick={handleDownloadCSV}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Download CSV
                  </button>
                  <button
                    onClick={handleDownloadPDF}
                    style={{
                      backgroundColor: '#007bff',
                      color: 'white',
                      padding: '8px 16px',
                      border: 'none',
                      borderRadius: '4px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s ease'
                    }}
                  >
                    Download PDF
                  </button>
                </div>

                <div className="col-md-3 ms-auto">
                  <div className="d-flex align-items-center justify-content-end">
                    <label className="me-2 text-muted fw-light">Show</label>
                    <select
                      className="form-select form-select-sm w-auto"
                      value={itemsPerPage}
                      onChange={(e) => {
                        setItemsPerPage(Number(e.target.value));
                        setCurrentPage(1);
                      }}
                    >
                      <option value={5}>5</option>
                      <option value={10}>10</option>
                      <option value={25}>25</option>
                      <option value={50}>50</option>
                      <option value={100}>100</option>
                    </select>
                    <label className="ms-2 text-muted fw-light">entries</label>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                  </div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </div>
              ) : (
                <div
                  className="table-responsive"
                  style={{
                    overflowY: "auto",
                    scrollbarWidth: "thin",
                    scrollbarColor: "#ccc transparent",
                  }}
                >
                  <table className="table table-hover table-striped align-middle">
                    <thead>
                      <tr className="bg-light">
                        {columns.map((column) => (
                          <th
                            key={column.field}
                            className="position-sticky top-0 bg-light py-3"
                            onClick={() => handleSort(column.field)}
                            style={{
                              cursor: "pointer",
                              width: column.width || "auto",
                              fontSize: "0.9rem",
                              fontWeight: "600",
                              textTransform: "uppercase",
                              letterSpacing: "0.5px",
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <span>{column.label}</span>
                              {sortField === column.field ? (
                                <i
                                  className={`ms-1 fa fa-sort-${
                                    sortDirection === "asc" ? "up" : "down"
                                  } text-primary`}
                                ></i>
                              ) : (
                                <i
                                  className="ms-1 fa fa-sort text-muted opacity-50"
                                  style={{ fontSize: "0.8rem" }}
                                ></i>
                              )}
                            </div>
                          </th>
                        ))}
                        <th
                          className="position-sticky top-0 bg-light py-3 text-center"
                          style={{
                            width: "100px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                          }}
                        >
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((requisition, index) => (
                          <tr
                            key={requisition.purchaseRequisitionNo}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${requisition.purchaseRequisitionNo}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={requisition[column.field]}
                              >
                                {requisition[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(requisition.id)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() =>
                                    deleteSelectedElement(requisition.id)
                                  }
                                  title="Delete"
                                >
                                  <i className="fa-solid fa-trash"></i>
                                </button>
                                {/* <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handlePrintClick(requisition)}
                                  title="Print"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button> */}
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length + 1}
                            className="text-center py-5"
                          >
                            {searchTerm ? (
                              <div>
                                <i className="fa fa-search fa-2x text-muted mb-3"></i>
                                <p className="mb-0">
                                  No matching records found
                                </p>
                              </div>
                            ) : (
                              <div>
                                <i className="fa fa-database fa-2x text-muted mb-3"></i>
                                <p className="mb-0">No data available</p>
                              </div>
                            )}
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="row mt-4 align-items-center">
                <div className="col-md-6">
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Showing{" "}
                    <span className="fw-bold text-dark">
                      {indexOfFirstItem + 1}
                    </span>{" "}
                    to{" "}
                    <span className="fw-bold text-dark">
                      {Math.min(indexOfLastItem, sortedData.length)}
                    </span>{" "}
                    of{" "}
                    <span className="fw-bold text-dark">
                      {sortedData.length}
                    </span>{" "}
                    entries
                    {searchTerm &&
                      ` (filtered from ${tableData.length} total entries)`}
                  </p>
                </div>
                <div className="col-md-6">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-end mb-0">
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(1)}
                          aria-label="First page"
                        >
                          <i className="fa-solid fa-angles-left"></i>
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          currentPage === 1 ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          aria-label="Previous page"
                        >
                          <i className="fa-solid fa-angle-left"></i>
                        </button>
                      </li>

                      {renderPageNumbers()}

                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          aria-label="Next page"
                        >
                          <i className="fa-solid fa-angle-right"></i>
                        </button>
                      </li>
                      <li
                        className={`page-item ${
                          currentPage === totalPages ? "disabled" : ""
                        }`}
                      >
                        <button
                          className="page-link border-0"
                          onClick={() => setCurrentPage(totalPages)}
                          aria-label="Last page"
                        >
                          <i className="fa-solid fa-angles-right"></i>
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewPurchaseRequisitionPage;

// import { useState } from 'react';
// import { Search } from 'lucide-react';

// export default function PurchaseOrderForm() {
//   const [batchNo, setBatchNo] = useState('');
//   const [formData, setFormData] = useState({
//     poNo: 'AMC/PO/21/04',
//     poDate: '21/01/2021',
//     reference: '',
//     items: [],
//     pAndF: 0,
//     transportation: 0,
//     insurance: 0,
//     otherCharges: 0
//   });

//   // Mock data to simulate search results
//   const mockItemsData = {
//     "BATCH123": [
//       { id: 1, srNo: 1, partNumber: 'P001', description: 'Component A', qty: 5, units: 'Ea', rate: 100 },
//       { id: 2, srNo: 2, partNumber: 'P002', description: 'Component B', qty: 10, units: 'Pcs', rate: 50 }
//     ],
//     "BATCH456": [
//       { id: 3, srNo: 1, partNumber: 'P003', description: 'Material X', qty: 2, units: 'Kg', rate: 200 },
//       { id: 4, srNo: 2, partNumber: 'P004', description: 'Material Y', qty: 3, units: 'L', rate: 150 }
//     ]
//   };

//   const handleSearch = () => {
//     if (batchNo && mockItemsData[batchNo]) {
//       setFormData({
//         ...formData,
//         items: mockItemsData[batchNo]
//       });
//     } else {
//       alert('Batch number not found');
//       setFormData({
//         ...formData,
//         items: []
//       });
//     }
//   };

//   const handleItemChange = (id, field, value) => {
//     // Convert value to number if applicable
//     const numValue = field === 'qty' || field === 'rate' ? parseFloat(value) || 0 : value;
    
//     const updatedItems = formData.items.map(item => {
//       if (item.id === id) {
//         return { ...item, [field]: numValue };
//       }
//       return item;
//     });

//     setFormData({
//       ...formData,
//       items: updatedItems
//     });
//   };

//   const handleAdditionalChargeChange = (field, value) => {
//     const numValue = parseFloat(value) || 0;
//     setFormData({
//       ...formData,
//       [field]: numValue
//     });
//   };

//   const calculateGross = (qty, rate) => {
//     return qty * rate;
//   };

//   const calculateSubtotal = () => {
//     return formData.items.reduce((total, item) => total + calculateGross(item.qty, item.rate), 0);
//   };

//   const calculateTotal = () => {
//     return calculateSubtotal() + 
//            formData.pAndF + 
//            formData.transportation + 
//            formData.insurance + 
//            formData.otherCharges;
//   };

//   const calculateTax = (rate) => {
//     return calculateTotal() * (rate / 100);
//   };

//   const calculateGrandTotal = () => {
//     return calculateTotal() + calculateTax(18) + calculateTax(9) + calculateTax(9);
//   };

//   // Combined CSS classes as JS objects
//   const styles = {
//     // Main container styles
//     container: {
//       backgroundColor: 'white',
//       padding: '1.5rem',
//       maxWidth: '64rem',
//       margin: '0 auto',
//       boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
//       borderRadius: '0.375rem',
//     },
//     header: {
//       marginBottom: '1.5rem',
//       textAlign: 'center',
//     },
//     headerTitle: {
//       fontSize: '1.5rem',
//       fontWeight: 'bold',
//     },
//     formContainer: {
//       border: '1px solid #d1d5db',
//       borderRadius: '0.375rem',
//       padding: '1rem',
//       marginBottom: '1.5rem',
//     },

//     // SearchSection styles
//     searchSection: {
//       display: 'flex',
//       marginBottom: '1.5rem',
//       gap: '1rem',
//       alignItems: 'center',
//     },
//     searchInputContainer: {
//       flex: 1,
//     },
//     searchLabel: {
//       display: 'block',
//       fontSize: '0.875rem',
//       fontWeight: 500,
//       color: '#374151',
//       marginBottom: '0.25rem',
//     },
//     searchInput: {
//       width: '100%',
//       border: '1px solid #d1d5db',
//       borderRadius: '0.375rem',
//       padding: '0.5rem 0.75rem',
//     },
//     searchButtonContainer: {
//       paddingTop: '1.5rem',
//     },
//     searchButton: {
//       backgroundColor: '#2563eb',
//       color: 'white',
//       padding: '0.5rem 1rem',
//       borderRadius: '0.375rem',
//       display: 'flex',
//       alignItems: 'center',
//       border: 'none',
//       cursor: 'pointer',
//     },
//     searchIcon: {
//       marginRight: '0.5rem',
//     },

//     // CompanySection styles
//     companySection: {
//       display: 'flex',
//       marginBottom: '1rem',
//     },
//     companyInfo: {
//       width: '50%',
//     },
//     companyLogo: {
//       display: 'flex',
//       alignItems: 'flex-start',
//       marginBottom: '0.5rem',
//     },
//     logoImage: {
//       marginRight: '1rem',
//     },
//     companyName: {
//       fontWeight: 'bold',
//       fontSize: '1.125rem',
//     },
//     companyAddress: {
//       fontSize: '0.875rem',
//     },
//     orderInfoSection: {
//       width: '50%',
//     },
//     orderInfoGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(2, 1fr)',
//       gap: '0.5rem',
//     },
//     orderInfoLabel: {
//       fontWeight: 'bold',
//     },

//     // AddressSection styles
//     addressSection: {
//       display: 'flex',
//       marginBottom: '1rem',
//     },
//     addressBox: {
//       width: '50%',
//       paddingRight: '0.5rem',
//     },
//     deliveryBox: {
//       width: '50%',
//       paddingLeft: '0.5rem',
//     },
//     addressContainer: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       height: '8rem',
//     },
//     addressTitle: {
//       fontWeight: 'bold',
//       marginBottom: '0.25rem',
//     },
//     addressText: {
//       fontSize: '0.875rem',
//     },

//     // PaymentTerms styles
//     paymentTerms: {
//       marginBottom: '1rem',
//     },
//     paymentContainer: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//     },
//     paymentTitle: {
//       fontWeight: 'bold',
//       marginBottom: '0.25rem',
//     },
//     paymentText: {
//       fontSize: '0.875rem',
//     },

//     // ItemsTable styles
//     tableContainer: {
//       marginBottom: '1rem',
//     },
//     table: {
//       width: '100%',
//       borderCollapse: 'collapse',
//     },
//     tableHead: {
//       backgroundColor: '#f3f4f6',
//     },
//     tableHeader: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       textAlign: 'left',
//     },
//     tableHeaderCenter: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       textAlign: 'center',
//     },
//     tableCell: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//     },
//     tableCellCenter: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       textAlign: 'center',
//     },
//     inputField: {
//       width: '100%',
//       border: '1px solid #e5e7eb',
//       borderRadius: '0.25rem',
//       padding: '0.25rem',
//       textAlign: 'center',
//     },

//     // FooterSection styles
//     footerSection: {
//       display: 'flex',
//     },
//     footerLeft: {
//       width: '50%',
//       paddingRight: '0.5rem',
//     },
//     legalText: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       fontSize: '0.875rem',
//     },
//     legalTitle: {
//       fontWeight: 'bold',
//       marginBottom: '0.25rem',
//     },
//     termsSection: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       marginTop: '0.5rem',
//       fontSize: '0.875rem',
//     },
//     termsTitle: {
//       fontWeight: 'bold',
//       marginBottom: '0.25rem',
//     },
//     termsGrid: {
//       display: 'grid',
//       gridTemplateColumns: 'repeat(2, 1fr)',
//       gap: '0.5rem',
//     },
//     totalSection: {
//       width: '50%',
//       paddingLeft: '0.5rem',
//     },
//     totalTable: {
//       width: '100%',
//       borderCollapse: 'collapse',
//     },
//     totalLabel: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       fontWeight: 'bold',
//     },
//     totalValue: {
//       border: '1px solid #d1d5db',
//       padding: '0.5rem',
//       textAlign: 'right',
//     },
//     signature: {
//       textAlign: 'right',
//       marginTop: '0.5rem',
//     },
//     signatureTitle: {
//       fontWeight: 'bold',
//     },
//     signatureSpace: {
//       marginTop: '2rem',
//     },

//     // FormFooter styles
//     formFooter: {
//       textAlign: 'right',
//       fontSize: '0.875rem',
//       marginTop: '1rem',
//     }
//   };

//   // Component functions defined inline
//   function SearchSectionComponent() {
//     return (
//       <div style={styles.searchSection}>
//         <div style={styles.searchInputContainer}>
//           <label style={styles.searchLabel}>Batch Number</label>
//           <input
//             type="text"
//             style={styles.searchInput}
//             value={batchNo}
//             onChange={(e) => setBatchNo(e.target.value)}
//             placeholder="Enter Batch Number (try BATCH123 or BATCH456)"
//           />
//         </div>
//         <div style={styles.searchButtonContainer}>
//           <button
//             onClick={handleSearch}
//             style={styles.searchButton}
//           >
//             <Search style={styles.searchIcon} size={18} />
//             Search
//           </button>
//         </div>
//       </div>
//     );
//   }

//   function CompanySectionComponent() {
//     return (
//       <div style={styles.companySection}>
//         <div style={styles.companyInfo}>
//           <div style={styles.companyLogo}>
//             <img src="/api/placeholder/100/50" alt="AMC Technology Logo" style={styles.logoImage} />
//             <div>
//               <h2 style={styles.companyName}>AMC TECHNOLOGY</h2>
//               <p style={styles.companyAddress}>105, Hiday Industrial Estate, Hira Industrial Park</p>
//               <p style={styles.companyAddress}>Off Western Express Highway, Vasai Phata,</p>
//               <p style={styles.companyAddress}>Vasai (East) Dist - Palghar, 401208</p>
//               <p style={styles.companyAddress}>GST NO: 27ABTPS4731Z1ZA</p>
//             </div>
//           </div>
//         </div>
//         <div style={styles.orderInfoSection}>
//           <div style={styles.orderInfoGrid}>
//             <div style={styles.orderInfoLabel}>P.O. No.:</div>
//             <div>{formData.poNo}</div>
//             <div style={styles.orderInfoLabel}>P.O. Date:</div>
//             <div>{formData.poDate}</div>
//             <div style={styles.orderInfoLabel}>Our Reference:</div>
//             <div>{formData.reference}</div>
//             <div style={styles.orderInfoLabel}>Your Reference:</div>
//             <div>{formData.reference}</div>
//             <div style={styles.orderInfoLabel}>Delivery:</div>
//             <div>E</div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   function AddressSectionComponent() {
//     return (
//       <div style={styles.addressSection}>
//         <div style={styles.addressBox}>
//           <div style={styles.addressContainer}>
//             <div style={styles.addressTitle}>To,</div>
//             <div style={styles.addressText}>E</div>
//           </div>
//         </div>
//         <div style={styles.deliveryBox}>
//           <div style={styles.addressContainer}>
//             <div style={styles.addressTitle}>Delivery Address:</div>
//             <div style={styles.addressText}>
//               AMC TECHNOLOGY<br />
//               105, Hiday Industrial Estate, Hira Industrial Park<br />
//               Off Western Express Highway, Vasai Phata,<br />
//               Vasai (East) Dist - Palghar, 401208
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   function PaymentTermsComponent() {
//     return (
//       <div style={styles.paymentTerms}>
//         <div style={styles.paymentContainer}>
//           <div style={styles.paymentTitle}>Payment Terms:</div>
//           <div style={styles.paymentText}>E</div>
//         </div>
//       </div>
//     );
//   }

//   function ItemsTableComponent() {
//     return (
//       <div style={styles.tableContainer}>
//         <table style={styles.table}>
//           <thead>
//             <tr style={styles.tableHead}>
//               <th style={styles.tableHeader}>Sr. No</th>
//               <th style={styles.tableHeader}>Part Number</th>
//               <th style={styles.tableHeader}>Description</th>
//               <th style={styles.tableHeaderCenter}>QTY</th>
//               <th style={styles.tableHeaderCenter}>Units</th>
//               <th style={styles.tableHeaderCenter}>Rate/Unit</th>
//               <th style={styles.tableHeaderCenter}>Gross</th>
//             </tr>
//           </thead>
//           <tbody>
//             {formData.items.length > 0 ? (
//               formData.items.map((item) => (
//                 <tr key={item.id}>
//                   <td style={styles.tableCell}>{item.srNo}</td>
//                   <td style={styles.tableCell}>{item.partNumber}</td>
//                   <td style={styles.tableCell}>{item.description}</td>
//                   <td style={styles.tableCellCenter}>
//                     <input
//                       type="number"
//                       style={styles.inputField}
//                       value={item.qty}
//                       onChange={(e) => handleItemChange(item.id, 'qty', e.target.value)}
//                     />
//                   </td>
//                   <td style={styles.tableCellCenter}>
//                     <input
//                       type="text"
//                       style={styles.inputField}
//                       value={item.units}
//                       onChange={(e) => handleItemChange(item.id, 'units', e.target.value)}
//                     />
//                   </td>
//                   <td style={styles.tableCellCenter}>
//                     <input
//                       type="number"
//                       style={styles.inputField}
//                       value={item.rate}
//                       onChange={(e) => handleItemChange(item.id, 'rate', e.target.value)}
//                     />
//                   </td>
//                   <td style={styles.tableCellCenter}>
//                     {calculateGross(item.qty, item.rate)}
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               Array(10).fill(0).map((_, index) => (
//                 <tr key={index}>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                   <td style={styles.tableCell}>&nbsp;</td>
//                 </tr>
//               ))
//             )}
//           </tbody>
//         </table>
//       </div>
//     );
//   }

//   function FooterSectionComponent() {
//     return (
//       <div style={styles.footerSection}>
//         <div style={styles.footerLeft}>
//           <div style={styles.legalText}>
//             <div style={styles.legalTitle}>JURISDICTION OF COURTS:</div>
//             <p>All contracts shall be deemed to have been wholly made in Mumbai and all claims thereunder are payable in Mumbai City and it is the distinct condition of the order that no suit or action for the purpose of enforcing any claim in respect of the order shall be instituted in any Court other than that situated in Mumbai City, Maharashtra State, India i.e. courts in Mumbai shall alone have jurisdiction to decide upon any dispute arising out of or in Respect of the contract.</p>
//           </div>
//           <div style={styles.termsSection}>
//             <div style={styles.termsTitle}>TERMS AND CONDITION:</div>
//             <div style={styles.termsGrid}>
//               <div>Incoterm:</div>
//               <div>Exworks, FOB</div>
//               <div>Currency:</div>
//               <div>USD, GBP, EURO, INR</div>
//               <div>Forwarder:</div>
//               <div>Text Box</div>
//             </div>
//           </div>
//         </div>
//         <div style={styles.totalSection}>
//           <table style={styles.totalTable}>
//             <tbody>
//               <tr>
//                 <td style={styles.totalLabel}>Gross</td>
//                 <td style={styles.totalValue}>
//                   {formData.items.length > 0 ? calculateSubtotal() : ''}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>P&F</td>
//                 <td style={styles.totalValue}>
//                   <input
//                     type="number"
//                     style={styles.inputField}
//                     value={formData.pAndF}
//                     onChange={(e) => handleAdditionalChargeChange('pAndF', e.target.value)}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>Transportation</td>
//                 <td style={styles.totalValue}>
//                   <input
//                     type="number"
//                     style={styles.inputField}
//                     value={formData.transportation}
//                     onChange={(e) => handleAdditionalChargeChange('transportation', e.target.value)}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>Insurance</td>
//                 <td style={styles.totalValue}>
//                   <input
//                     type="number"
//                     style={styles.inputField}
//                     value={formData.insurance}
//                     onChange={(e) => handleAdditionalChargeChange('insurance', e.target.value)}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>Other Charges</td>
//                 <td style={styles.totalValue}>
//                   <input
//                     type="number"
//                     style={styles.inputField}
//                     value={formData.otherCharges}
//                     onChange={(e) => handleAdditionalChargeChange('otherCharges', e.target.value)}
//                   />
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>Total</td>
//                 <td style={styles.totalValue}>
//                   {formData.items.length > 0 ? calculateTotal() : ''}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>SGST @ 9%</td>
//                 <td style={styles.totalValue}>
//                   {formData.items.length > 0 ? calculateTax(9) : ''}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>CGST @ 9%</td>
//                 <td style={styles.totalValue}>
//                   {formData.items.length > 0 ? calculateTax(9) : ''}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>IGST @ 18%</td>
//                 <td style={styles.totalValue}>
//                   {formData.items.length > 0 ? calculateTax(18) : ''}
//                 </td>
//               </tr>
//               <tr>
//                 <td style={styles.totalLabel}>Grand Total</td>
//                 <td style={styles.totalValue}>
//                   {formData.items.length > 0 ? calculateGrandTotal() : ''}
//                 </td>
//               </tr>
//             </tbody>
//           </table>
//           <div style={styles.signature}>
//             <div style={styles.signatureTitle}>FOR AMC TECHNOLOGY</div>
//             <div style={styles.signatureSpace}>
//               <div style={styles.signatureTitle}>Authorised Signatory</div>
//             </div>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   function FormFooterComponent() {
//     return (
//       <div style={styles.formFooter}>
//         <p>Form: AMC-32</p>
//         <p>Rev:00</p>
//         <p>Date: Jan 2021</p>
//       </div>
//     );
//   }

//   // Main component return
//   return (
//     <div style={styles.container}>
//       <div style={styles.header}>
//         <h1 style={styles.headerTitle}>PURCHASE ORDER</h1>
//       </div>
      
//       <SearchSectionComponent />
      
//       <div style={styles.formContainer}>
//         <CompanySectionComponent />
//         <AddressSectionComponent />
//         <PaymentTermsComponent />
//         <ItemsTableComponent />
//         <FooterSectionComponent />
//         <FormFooterComponent />
//       </div>
//     </div>
//   );
// }