import { useEffect, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
    getCustomerOrder,
    deleteReport,
    getEditOrderList,
    ApproveReport,
} from "../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { Modal, Button, Form } from "react-bootstrap";
import {PrintInspectionReport} from "./PrintInspectionReport";
import styles from "./Checker/EditSupplier/EditSupplierTable.module.css";
//import { ApproveReport, deleteReport } from "../services/db_manager";
const EditCustomerOrderTable = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("formId");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  // Modified: Changed selectedItems from array to single string ID
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
      const response = await getEditOrderList();
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

  // Modified: Handle checkbox selection for single selection only
  const handleCheckboxChange = (report) => {
    // If the same checkbox is clicked again, deselect it
    if (selectedItem === report.srNo) {
      setSelectedItem("");
      console.log("Selected ID: none");
    } else {
      setSelectedItem(report.srNo);
      setSelecteReportData(report);
      console.log("Selected ID:", report.srNo);
    }
  };

  // Modified: Handle select all - now it just clears selection
  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItem("");
      console.log("Selected ID: none");
    } else {
      // Select the first item when clicking "select all"
      if (currentItems.length > 0) {
        const firstItemId = currentItems[0].formId;
        setSelectedItem(firstItemId);
        console.log("Selected ID:", firstItemId);
      }
    }
    setSelectAll(!selectAll);
  };

  // Reset selection when page changes
  useEffect(() => {
    setSelectedItem("");
    setSelectAll(false);
  }, [currentPage, itemsPerPage]);

  const deleteSelectedElement = async (elementId) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        const response = await deleteReport(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((report) => report.formId !== elementId)
          );
          toast.success("Report deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete report", error);
        toast.error("Failed to delete report Please try again.");
      }
    }
  };

  const editSelectedElement = async (elementId) => {
    if (elementId !== "") {
      try {
        let reportId = elementId;
        let reportData = await getCustomerOrder(elementId);
        reportData = reportData.data;
        if (reportId !== null) {
          navigate("/editCustomerOrderform", {
            state: { reportId, reportData },
          });
        }
      } catch (error) {
        console.error("Error fetching report details: ", error);
        toast.error("Failed to fetch report details");
      }
    }
  };

  // Modal handlers
  const handleOpenModal = (type) => {
    if (!selectedItem) {
      toast.warning("Please select a report");
      return;
    }
    setActionType(type);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setRemark("");
  };

  const handleSubmitAction = async () => {
    const action = actionType === "accept" ? "accepted" : "rejected";
    // Add 'remark' to each object in selecteReportData
    const updatedReportData = {
      ...selecteReportData,
      remark: remark,
      userRole:sessionStorage.getItem('roleId'),
      userAction: action === "rejected" ? "3" : "2",
    };
    try {
      const response = await ApproveReport(updatedReportData);
      toast.success(`Report ${action} successfully, ${response}`);
      fetchData();
    } catch (error) {
      console.error("Error fetching report details: ", error);
      toast.error("Failed to fetch report details");
    }
  
    // Reset states
    setSelectedItem("");
    setSelectAll(false);
    setRemark("");
    handleCloseModal();
  };
  

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

  const handlePrintClick = (report) => {
    // Store the supplier data
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
    { field: "orderNo", label: "Order No", width: "100px" },
    { field: "roNo", label: "RO No.", width: "100px" },
    { field: "roReceiveDate", label: "RO Received Date", width: "100px" },
    { field: "customerName", label: "Customer Name", width: "100px" },
    { field: "partNo", label: "Part No.", width: "100px" },
    { field: "partDescription", label: "Part Desc", width: "100px" },
    { field: "quantity", label: "Quantity", width: "100px" },
    { field: "batchNo", label: "Batch No.", width: "100px" },
    { field: "srNo", label: "Sr. No.", width: "100px" },
    { field: "status", label: "Status", width: "100px" },
    { field: "makerUserName", label: "Maker UserName", width: "100px" },
    { field: "makerDate", label: "Maker Date", width: "100px" },
    { field: "userRole", label: "Maker Role", width: "100px" },

];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Edit CustomerOrder" />
          <div className="printView">
            <PrintInspectionReport dataMap={reportData} />
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
                                  id={`check-${report.srNo}`}
                                  checked={selectedItem === report.srNo}
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
                                  onClick={() =>
                                    editSelectedElement(report.srNo)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                {/* <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(supplier.supplierId)
                                  }
                                  title="View Doc"
                                >
                                  <i className="fa-solid fa-eye"></i>
                                </button> */}
                                {/* <button
                                  className="btn btn-sm btn-outline-secondary"
                                  onClick={() => handlePrintClick(supplier)}
                                  title="Print Doc"
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

              {/* Accept/Reject Buttons */}
              {/* <div className="d-flex justify-content-end mt-3 gap-3">
                <button
                  className="btn btn-outline-success"
                  onClick={() => handleOpenModal("accept")}
                  disabled={!selectedItem}
                >
                  <i className="fa-solid fa-check me-2"></i>
                  Approved
                </button>
                <button
                  className="btn btn-outline-info"
                  onClick={() => handleOpenModal("Send To Edit")}
                  disabled={!selectedItem}
                >
                  <i className="fa-solid fa-paper-plane me-2"></i>
                  Send To Edit
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => handleOpenModal("reject")}
                  disabled={!selectedItem}
                >
                  <i className="fa-solid fa-xmark me-2"></i>
                  Reject
                </button>
              </div> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>

      {/* Accept/Reject Modal */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "accept"
              ? "Accept"
              : actionType === "Edit"
              ? "Send To Edit"
              : "Reject"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to {actionType} the selected order?</p>
          <Form.Group className="mb-3">
            <Form.Label>Remark</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder="Enter your remarks here..."
              required
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button
            variant={actionType === "accept" ? "success" : "danger"}
            onClick={handleSubmitAction}
            disabled={!remark.trim()}
          >
            Confirm{" "}
            {actionType === "accept"
              ? "Accept"
              : actionType === "Edit"
              ? "Send"
              : "Reject"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditCustomerOrderTable;
