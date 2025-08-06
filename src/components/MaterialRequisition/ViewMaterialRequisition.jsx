import { useEffect, useState } from "react";
import Footer from "../Footer";
import Header from "../Header";
import Sidebar from "../Sidebar";
import {
  listAllMaterialRequisition,
  deleteMaterialRequisition,
  getMaterialRequisitionDetail,
} from "../../services/db_manager";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import MaterialRequisitionForm from "./MaterialRequisitionReport";
import styles from "./Viewrequisition.module.css";

const ViewMaterialRequisitionPage = () => {
  // State
  const [tableData, setTableData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("materialRequisitionNo");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  const [requisitionData, setRequisitionData] = useState();
  const navigate = useNavigate();

  const fetchData = async () => {
    // setIsLoading(true);
    try {
      const response = await listAllMaterialRequisition();
      setTableData(response || []);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching material requisitions", error);
      toast.error("Failed to load material requisitions");
    } finally {
      setIsLoading(false);
    }
  };
  // Fetching data when the component is mounted
  useEffect(() => {
    fetchData();
  }, []);

  // Delete the selected material requisition
  const deleteSelectedElement = async (materialRequisitionID) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        await deleteMaterialRequisition(materialRequisitionID);
        setTableData((prevData) =>
          prevData.filter(
            (requisition) =>
              requisition.materialRequisitionID !== materialRequisitionID
          )
        );
        toast.success("Material requisition deleted successfully!");
        fetchData();
      } catch (error) {
        console.error("Failed to delete material requisition", error);
        toast.error("Failed to delete material requisition. Please try again.");
      }
    }
  };

  // Edit the selected material requisition
  const editSelectedElement = async (RequisitionID) => {
    try {
      const response = await getMaterialRequisitionDetail(RequisitionID);
      const requisitionData = response?.data;
      if (requisitionData) {
        navigate("/editmaterialrequisition", {
          state: { RequisitionID },
        });
      }
    } catch (error) {
      console.error("Error fetching material requisition details: ", error);
      toast.error("Failed to fetch material requisition details");
    }
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
    { field: "materialRequisitionNo", label: "Requisition No", width: "140px" },
    { field: "workOrderNo", label: "Workorder No", width: "130px" },
    { field: "date", label: "Date", width: "120px" },
    { field: "partNo", label: "Part No", width: "120px" },
    { field: "description", label: "Description", width: "200px" },
    { field: "requestedQty", label: "Requested Qty", width: "130px" },
    { field: "issueQty", label: "Issue Qty", width: "120px" },
    { field: "issuedQty", label: "Issued Qty", width: "120px" },
    { field: "batchLotNo", label: "Batch/Lot", width: "120px" },
    { field: "unitOfMeasurement", label: "UOM", width: "140px" },
  ];

  const handlePrintClick = (requisition) => {
    // console.log(requisition, "requisition");
    setRequisitionData(requisition);
    setTimeout(() => {
      window.print();
    }, 500);
  };
  // useEffect(() => {
  //   console.log(requisitionData?.batchLotNo, "requisitionDatsdsdsdsdsdsdsda");
  // }, [requisitionData]);
  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="View Material Requisitions" />
          <div className="printView">
            <MaterialRequisitionForm tableData={requisitionData} />
          </div>
          <div
            className={[
              "normalView",
              "card border-0 shadow-lg mx-4 my-4 rounded-3",
              styles.normalViewStyle,
            ].join(" ")}
          >
            {/* <div > */}
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
                      placeholder="Search requisitions..."
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
                {/* <button
                  className={styles.printBtn}
                  onClick={() => handlePrintClick()}
                >
                  {" "}
                  Print
                </button> */}
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
                            key={requisition.materialRequisitionNo}
                            className={
                              index % 2 === 0
                                ? "bg-white"
                                : "bg-light bg-opacity-50"
                            }
                          >
                            {columns.map((column) => (
                              <td
                                key={`${requisition.materialRequisitionNo}-${column.field}`}
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
                                <button
                                  // className={styles.printBtn}
                                  // style={{ background: "#adc2ff" }}
                                  onClick={() => handlePrintClick(requisition)}
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
            {/* </div> */}
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewMaterialRequisitionPage;
