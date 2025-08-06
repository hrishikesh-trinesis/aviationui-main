import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
    getCAFormList,
    getCAForm,
    deleteCAForm,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import {PrintCAForm} from "./PrintCAForm";
import styles from "./Checker/EditSupplier/EditSupplierTable.module.css";
const ViewCAForm = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [selectAll, setSelectAll] = useState(false);
  const [selecteReportData, setSelecteReportData] = useState();

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState(""); // "accept" or "reject"
  const [remark, setRemark] = useState("");
  const [reportData, setReportData] = useState();

  const navigate = useNavigate();
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await getCAFormList();
      if (response) {
        console.log(response);
        if (response?.data) {
          setTableData(response.data);
        } else if (Array.isArray(response)) {
          setTableData(response);
        } else {
          console.error("Unexpected response format:", response);
          setTableData([]);
        }
      }
    } catch (error) {
      console.error("Error fetching data", error);
      toast.error("Failed to load reports");
    } finally {
      setIsLoading(false);
    }
  };
  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Reset selection when page changes
  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  // Search functionality
  const filteredData = Array.isArray(tableData)
  ? tableData.filter((report) =>
      Object.values(report).some(
        (value) =>
          value &&
          value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
  : [];


  const deleteSelectedElement = async (elementId) => {
      if (window.confirm("Are you sure you want to delete this CA Form?")) {
        try {
          const response = await deleteCAForm(elementId);
          if (response) {
            setTableData((prevData) =>
              prevData.filter((report) => report.formId !== elementId)
            );
            toast.success("CA Form deleted successfully");
          }
        } catch (error) {
          console.error("Failed to delete CA Form", error);
          toast.error("Failed to delete CA Form Please try again.");
        }
      }
    };
  
    const editSelectedElement = async (elementId) => {
      if (elementId !== "") {
        try {
          let reportId = elementId;
          let reportData = await getCAForm(elementId);
          reportData = reportData.data;
          if (reportId !== null) {
            navigate("/editCAForm", {
              state: { reportId, reportData },
            });
          }
        } catch (error) {
          console.error("Error fetching CA Form details: ", error);
          toast.error("Failed to fetch CA Form details");
        }
      }
    };


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
const handleCheckboxChange = (report) => {
    // If the same checkbox is clicked again, deselect it
    if (selectedItem === report.id) {
      setSelectedItem("");
    } else {
      setSelectedItem(report.id);
      setSelecteReportData(report);
    }
  };

  // Modified: Handle select all - now it just clears selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItem("");
    } else {
      // Select the first item when clicking "select all"
      if (currentItems.length > 0) {
        const firstItemId = currentItems[0].formId;
        setSelectedItem(firstItemId);
      }
    }
    setSelectAll(!selectAll);
  };
  const handlePrintClick = (report) => {
    // Store the report data
    console.log("Report",report)
    setReportData(report);

    // Short delay to ensure React has updated the state and rendered the component
    setTimeout(() => {
      // Cache original body styles
      const originalBodyStyle = document.body.style.cssText;

      // Apply print-friendly styles to the body
      document.body.style.margin = "0";
      document.body.style.padding = "0";

      // Print the document
      window.print();

      // Restore original body styles after printing dialog is closed
      setTimeout(() => {
        document.body.style.cssText = originalBodyStyle;
      }, 100);
    }, 500);
  };


  // Column definitions for the table
  const columns = [
    { field: "formTrackingNumber", label: "Form Trackking No.", width: "100px" },
    { field: "workOrderNo", label: "WorkOrder Number", width: "100px" },
    { field: "item", label: "Item", width: "100px" },
    { field: "description", label: "Description", width: "100px" },
    { field: "partNo", label: "Part No.", width: "100px" },
    { field: "quantity", label: "Quantity", width: "100px" },
    { field: "serialNo", label: "Serial No.", width: "100px" },
    { field: "status", label: "Status", width: "100px" },
    { field: "remarks", label: "Remarks", width: "100px" },
    { field: "approveDesign13a", label: "Approved design data", width: "100px" },
    { field: "nonApproveDesign13a", label: "Non-approved design data", width: "100px" },
    { field: "otherRegulation14a", label: "Other regulation specified to Service", width: "100px" },
    { field: "authorisedSign13b", label: " Authorised Signature", width: "100px" },
    { field: "authorisationNumber13c", label: "Approval / Authorisation Number", width: "100px" },
    { field: "name13d", label: "Name", width: "100px" },
    { field: "date13e", label: "Date", width: "100px" },
    { field: "selfLiauthorisedSign14bfeObservation", label: "Authorised Signature", width: "100px" },
    { field: "approvalRefNo14c", label: "Certificate / Approval Ref No", width: "100px" },
    { field: "name14d", label: "Name", width: "100px" },
    { field: "date14e", label: "Date", width: "100px" },
];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Inspection Report" />
          <div className="printView">
            <PrintCAForm dataMap={reportData} />
          </div>

          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
              styles.normalViewStyle,
            ].join(" ")}
          >
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search reports..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
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
                    {/* <span className="visually-hidden"></span> */}
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
                      <tr className="bg-blue">
                        <th
                          className="position-sticky top-0 bg-light py-3 text-center"
                          style={{ width: "40px" }}
                        >
                          <div className="form-check d-flex justify-content-center">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id="selectAll"
                              checked={selectAll}
                              onChange={handleSelectAll}
                            />
                          </div>
                        </th>
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
                        currentItems.map((report, index) => (
                          <tr
                            key={report.formId}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            <td className="text-center">
                              <div className="form-check d-flex justify-content-center">
                                <input
                                  className="form-check-input"
                                  type="checkbox"
                                  id={`check-${report.id}`}
                                  checked={selectedItem === report.id}
                                  onChange={() =>
                                    handleCheckboxChange(report)
                                  }
                                />
                              </div>
                            </td>
                            {columns.map((column) => (
                              <td
                                key={`${report.formId}-${column.field}`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={report[column.field]}
                              >
                                {report[column.field]}
                              </td>
                            ))}
                             <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => editSelectedElement(report.id)}
                                title="Edit"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteSelectedElement(report.id)}
                                title="Delete"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                                <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handlePrintClick(report)}
                                  title="Print Doc"
                                >
                                  <i className="fa-solid fa-print"></i>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={columns.length + 2}
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

export default ViewCAForm;
