import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getAllDispatchReports,
  deleteDispatchReport,
} from "../services/db_manager";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";

const ViewDispatchReport = () => {
  const [dispatchReports, setDispatchReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadDispatchReports();
  }, []);

  const loadDispatchReports = async () => {
    try {
      const response = await getAllDispatchReports();
      setDispatchReports(response.data);
    } catch (error) {
      console.error("Error fetching dispatch reports", error);
    }
  };

  const handleEdit = (report) => {
    navigate("/edit-dispatch-report", { state: { report } });
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this report?")) {
      try {
        await deleteDispatchReport(id);
        loadDispatchReports();
      } catch (error) {
        console.error("Error deleting report", error);
        alert("Failed to delete report.");
      }
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Dispatch Reports</h2>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th style={thStyle}>Report No</th>
                <th style={thStyle}>Date</th>
                <th style={thStyle}>Part No</th>
                <th style={thStyle}>Description</th>
                <th style={thStyle}>Quantity</th>
                <th style={thStyle}>WO/JO No</th>
                <th style={thStyle}>Customer</th>
                <th style={thStyle}>Checklist</th>
                <th style={thStyle}>Packing Details</th>
                <th style={thStyle}>Remark</th>
                <th style={thStyle}>Store In-Charge</th>
                <th style={thStyle}>Despatch In-Charge</th>
                <th style={thStyle}>Action</th>
              </tr>
            </thead>
            <tbody>
              {dispatchReports.map((report) => (
                <tr key={report.id}>
                  <td style={tdStyle}>{report.reportNumber}</td>
                  <td style={tdStyle}>{report.date}</td>
                  <td style={tdStyle}>{report.partNumber}</td>
                  <td style={tdStyle}>{report.description}</td>
                  <td style={tdStyle}>{report.quantity}</td>
                  <td style={tdStyle}>{report.wojoNumber}</td>
                  <td style={tdStyle}>{report.customer}</td>
                  <td style={tdStyle}>{report.checklist}</td>
                  <td style={tdStyle}>{report.packingDetails}</td>
                  <td style={tdStyle}>{report.remark}</td>
                  <td style={tdStyle}>{report.storeIncharge}</td>
                  <td style={tdStyle}>{report.despatchIncharge}</td>
                  <td style={tdStyle}>
                    <button onClick={() => handleEdit(report)} style={editBtn}>
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(report.id)}
                      style={deleteBtn}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {dispatchReports.length === 0 && (
                <tr>
                  <td colSpan="13" style={tdStyle}>
                    No dispatch reports found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

// Styles
const thStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  backgroundColor: "#f0f0f0",
  textAlign: "left",
  whiteSpace: "nowrap",
};

const tdStyle = {
  border: "1px solid #ccc",
  padding: "8px",
  verticalAlign: "top",
};

const editBtn = {
  marginRight: "8px",
  padding: "5px 10px",
  backgroundColor: "#4CAF50",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

const deleteBtn = {
  padding: "5px 10px",
  backgroundColor: "#f44336",
  color: "#fff",
  border: "none",
  borderRadius: "4px",
  cursor: "pointer",
};

export default ViewDispatchReport;
