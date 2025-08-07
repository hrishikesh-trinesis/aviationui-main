import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  deletePurchaseOrder,
  listAllWorkorder,
} from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
// import PurchaseOrderReport from "../PurchaseOrderReport/PurchaseOrderReport";
// import styles from "../ViewPurchaseOrder/ViewPurchaseOrder.module.css";
import PurchaseOrderForm from "../PurchaseOrder/PurchaseOrderReport/PurchaseOrderReport";

const ViewWorkOrder = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("orderNo");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [workOrderData, setWorkOrderData] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const response = await listAllWorkorder();
      setTableData(response.data || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching work orders", error);
      toast.error("Failed to load work orders");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Delete the selected work order
  const deleteSelectedElement = async (orderNo) => {
    if (window.confirm("Are you sure you want to delete this work order?")) {
      try {
        await deletePurchaseOrder(orderNo); // You might need to update this service call
        setTableData((prevData) =>
          prevData.filter((workOrder) => workOrder.orderNo !== orderNo)
        );
        toast.success("Work order deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete work order", error);
        toast.error("Failed to delete work order. Please try again.");
      }
    }
  };

  // Edit the selected work order
  const editSelectedElement = async (srNo) => {
    navigate("/Addworkorder", {
      state: { srNo },
    });
  };

  // Search functionality
  const filteredData = tableData.filter((workOrder) => {
    return Object.entries(workOrder)
      .filter(
        ([key]) => !["documentPath", "makerDate", "checkerDate"].includes(key)
      ) // Exclude certain fields from search
      .some(
        ([_, value]) =>
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

  // Column definitions for the table - updated for work order data
  const columns = [
    { field: "orderNo", label: "Order No", width: "140px" },
    { field: "srNo", label: "SR No", width: "100px" },
    { field: "customerName", label: "Customer Name", width: "150px" },
    { field: "partDesc", label: "Part Description", width: "150px" },
    { field: "partNo", label: "Part No", width: "120px" },
    { field: "qty", label: "Quantity", width: "100px" },
    { field: "status", label: "Status", width: "100px" },
    { field: "workOrder", label: "Work Order", width: "120px" },
    { field: "makerUserName", label: "Maker", width: "120px" },
    { field: "makerDate", label: "Maker Date", width: "140px" },
    { field: "checkerUserName", label: "Checker", width: "120px" },
    { field: "checkerDate", label: "Checker Date", width: "140px" },
    // { field: "userRole", label: "User Role", width: "100px" },
    // { field: "userAction", label: "User Action", width: "110px" },
    { field: "remark", label: "Remark", width: "120px" },
  ];

  const handlePrintClick = (workOrder) => {
    setWorkOrderData(workOrder);
    setTimeout(() => {
      window.print();
    }, 500);
  };

  // Format date values
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString() + " " + date.toLocaleTimeString();
  };

  // Format boolean values
  const formatBoolean = (value) => {
    return value ? "Yes" : "No";
  };

  // Format status with badge
  const formatStatus = (status) => {
    const statusClass =
      status === "open" ? "badge bg-success" : "badge bg-secondary";
    return <span className={statusClass}>{status}</span>;
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Work Orders" />
          <div className="printView">
            <PurchaseOrderForm tableData={workOrderData} />
          </div>
          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
              //   styles.normalViewStyle,
            ].join(" ")}
          >
            <div className="card-body">
              <div className="row align-items-center mb-4">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-primary text-white border-0">
                      <i className="fa fa-search"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0 ps-0"
                      placeholder="Search work orders..."
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
                  <div
                    className="spinner-border text-primary"
                    role="status"
                  ></div>
                  <p className="mt-2 text-muted">Loading data...</p>
                </div>
              ) : (
                <div
                  className="table-responsive"
                  style={{
                    overflowX: "auto",
                    overflowY: "auto",
                    maxHeight: "65vh",
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
                              whiteSpace: "nowrap",
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
                            width: "150px",
                            fontSize: "0.9rem",
                            fontWeight: "600",
                            textTransform: "uppercase",
                            letterSpacing: "0.5px",
                            whiteSpace: "nowrap",
                          }}
                        >
                          ACTIONS
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentItems.length > 0 ? (
                        currentItems.map((workOrder, index) => (
                          <tr
                            key={workOrder.orderNo || index}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${workOrder.orderNo || index}-${
                                  column.field
                                }`}
                                className="text-nowrap py-3"
                                style={{
                                  maxWidth: "150px",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                  whiteSpace: "nowrap",
                                }}
                                title={workOrder[column.field]}
                              >
                                {column.field === "status"
                                  ? formatStatus(workOrder[column.field])
                                  : column.field === "workOrder"
                                  ? formatBoolean(workOrder[column.field])
                                  : ["makerDate", "checkerDate"].includes(
                                      column.field
                                    )
                                  ? formatDate(workOrder[column.field])
                                  : column.field === "partDesc"
                                  ? workOrder[column.field]?.substring(0, 20) +
                                    (workOrder[column.field]?.length > 20
                                      ? "..."
                                      : "")
                                  : column.field === "remark"
                                  ? workOrder[column.field]?.substring(0, 15) +
                                    (workOrder[column.field]?.length > 15
                                      ? "..."
                                      : "")
                                  : workOrder[column.field]}
                              </td>
                            ))}
                            <td>
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-sm btn-outline-primary"
                                  onClick={() =>
                                    editSelectedElement(workOrder.srNo)
                                  }
                                  title="Edit"
                                >
                                  <i className="fa-solid fa-pen-to-square"></i>
                                </button>
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

export default ViewWorkOrder;
