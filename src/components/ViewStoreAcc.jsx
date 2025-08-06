import { useEffect, useRef, useState } from "react";
import Footer from "./Footer";
import Header from "./Header";
import Sidebar from "./Sidebar";
import {
  deleteStore,
  getStoreDetail,
  listAllStore,
} from "../services/db_manager";
import MyModalComponent from "./partials/MyModalComponent";
import { useNavigate } from "react-router-dom";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { toast } from "react-toastify";
import { width } from "@fortawesome/free-solid-svg-icons/fa0";

const ViewSupplierRegis = () => {
  // State
  const [tableData, setTableData] = useState([]); // Store data
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");
  const [isLoading, setIsLoading] = useState(true);
  
  const navigate = useNavigate();
  const modalRef = useRef(); // Modal reference

  // Fetching data when the component is mounted
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
      const response = await listAllStore();
      if (response && !response.every(item => item === null)) {
        setTableData(response);
      } else {
        setTableData([]);
      }
      } catch (error) {
        toast.error("Failed to load store data");
        // Set empty array in case of error too
        setTableData([]);
      } finally {
      setIsLoading(false);
    }
    };
    fetchData();
  }, []);

  // Delete the selected supplier
  async function deleteSelectedElement(elementId) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      try {
        const response = await deleteStore(elementId);
        if (response) {
          setTableData((prevData) =>
            prevData.filter((item) => item.id !== elementId)
          );
          toast.success("Item deleted successfully");
        }
      } catch (error) {
        console.error("Failed to delete item", error);
        toast.error("Failed to delete item. Please try again.");
      }
    }
  }

  // Edit the selected supplier
  async function editSelectedElement(elementId) {
    // console.log("123344");
    // navigate("/editstoreAcceptance", {
    //       state: { elementId },
    //     });
     try {
       const response = await getStoreDetail(elementId);
      const supplierData = response.data;
      
        navigate("/editstoreAcceptance", {
          state: { elementId },
        })
      
    } catch (error) {
      console.error("Error fetching store details: ", error);
      toast.error("Failed to fetch store details");
    }
  }

  // Search functionality
  const filteredData = tableData.filter((store) => {
    return Object.values(store).some(
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
        <li key={i} className={`page-item ${currentPage === i ? "active" : ""}`}>
          <button
            className="page-link"
            onClick={() => setCurrentPage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    
    return pageNumbers;
  };

  // Column definitions for the table
  const columns = [
    {field: "id", label: "ID", width: "80px"},
    { field: "partNum", label: "Part Num", width: "80px" },
    { field: "description", label: "Description", width: "200px" },
    { field: "batch", label: "Batch" },
    { field: "supplier", label: "Supplier" },
    { field: "quantity", label: "Quantity" },
    { field: "dom", label: "DOM" },
    { field: "doe", label: "DOE" },
    { field: "dateOfRecipet", label: "Receipt Date" },
    { field: "nameOfQualityInsp", label: "Quality Inspector" }
  ];

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="View Store Acceptance" />

        <div className="card border-0 shadow-lg mx-4 my-4 rounded-3">
          <div className="card-body">
            <div className="row  align-items-center">
              <div className="col-md-6">
                <div className="input-group">
                  <span className="input-group-text bg-primary text-white border-0">
                    <i className="fa fa-search"></i>
                  </span>
                  <input
                    type="text"
                    className="form-control border-start-0 ps-0"
                    placeholder="Search items..."
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
                  {/* <span className="visually-hidden">Loading...</span> */}
                </div>
                <p className="mt-2 text-muted">Loading data...</p>
              </div>
            ) : (
              <div 
                className="table-responsive" 
                style={{
                  // height: "60vh",
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
                            letterSpacing: "0.5px"
                          }}
                        >
                          <div className="d-flex align-items-center">
                            <span>{column.label}</span>
                            {sortField === column.field ? (
                              <i className={`ms-1 fa fa-sort-${sortDirection === "asc" ? "up" : "down"} text-primary`}></i>
                            ) : (
                              <i className="ms-1 fa fa-sort text-muted opacity-50" style={{ fontSize: "0.8rem" }}></i>
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
                          letterSpacing: "0.5px"
                        }}
                      >
                        ACTIONS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentItems.length > 0 ? (
                      currentItems.map((store, index) => (
                        <tr 
                          key={store.partNum} 
                          className={index % 2 === 0 ? "bg-white" : "bg-light bg-opacity-50"}
                        >
                          {columns.map((column) => (
                            <td 
                              key={`${store.partNum}-${column.field}`}
                              className="text-nowrap py-3"
                              style={{ 
                                maxWidth: "150px",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap"
                              }}
                              title={store[column.field]}
                            >
                              {store[column.field]}
                            </td>
                          ))}
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => editSelectedElement(store.id)}
                                title="Edit"
                              >
                                <i className="fa-solid fa-pen-to-square"></i>
                              </button>
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => deleteSelectedElement(store.partNum)}
                                title="Delete"
                              >
                                <i className="fa-solid fa-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length + 1} className="text-center py-5">
                          {searchTerm ? (
                            <div>
                              <i className="fa fa-search fa-2x text-muted mb-3"></i>
                              <p className="mb-0">No matching records found</p>
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
                  Showing <span className="fw-bold text-dark">{indexOfFirstItem + 1}</span> to <span className="fw-bold text-dark">{Math.min(indexOfLastItem, sortedData.length)}</span> of <span className="fw-bold text-dark">{sortedData.length}</span> entries
                  {searchTerm && ` (filtered from ${tableData.length} total entries)`}
                </p>
              </div>
              <div className="col-md-6">
                <nav aria-label="Page navigation">
                  <ul className="pagination justify-content-end mb-0">
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link border-0"
                        onClick={() => setCurrentPage(1)}
                        aria-label="First page"
                      >
                        <i className="fa-solid fa-angles-left"></i>
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                      <button
                        className="page-link border-0"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        aria-label="Previous page"
                      >
                        <i className="fa-solid fa-angle-left"></i>
                      </button>
                    </li>
                    
                    {renderPageNumbers()}
                    
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                      <button
                        className="page-link border-0"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        aria-label="Next page"
                      >
                        <i className="fa-solid fa-angle-right"></i>
                      </button>
                    </li>
                    <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
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
        
        <MyModalComponent
          ref={modalRef}
          modalTitle="My Custom Modal Title"
          modalBodyContent="This is a custom body for the modal."
          buttonLabel="Open Modal"
        />
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default ViewSupplierRegis;