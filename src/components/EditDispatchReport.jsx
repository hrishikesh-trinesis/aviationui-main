import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar from "./Sidebar";
import Footer from "./Footer";
import { updateDispatchReport } from "../services/db_manager";
import { toast } from "react-toastify";

const EditDispatchReport = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    id: "",
    reportNumber: "",
    date: "",
    partNumber: "",
    description: "",
    quantity: "",
    wojoNumber: "",
    customer: "",
    checklist: "",
    packingDetails: "",
    remark: "",
    storeIncharge: "",
    despatchIncharge: "",
  });

  useEffect(() => {
    if (state && state.report) {
      setFormData(state.report);
    } else {
      toast.error("No data to edit");
      navigate("/view-dispatch-reports");
    }
  }, [state, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDispatchReport(formData.id, formData);
      toast.success("Dispatch report updated successfully");
      navigate("/view-dispatch-reports");
    } catch (error) {
      console.error("Update failed:", error);
      toast.error("Error updating dispatch report");
    }
  };

  return (
    <div>
      <Header />
      <Sidebar />
      <div style={{ marginLeft: "220px", padding: "20px" }}>
        <h2>Edit Dispatch Report</h2>
        <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
          {[
            "reportNumber",
            "date",
            "partNumber",
            "description",
            "quantity",
            "wojoNumber",
            "customer",
            "checklist",
            "packingDetails",
            "remark",
            "storeIncharge",
            "despatchIncharge",
          ].map((field) => (
            <div key={field} style={{ marginBottom: "15px" }}>
              <label style={{ display: "block", marginBottom: "5px" }}>
                {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
              </label>
              <input
                type="text"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                style={{ width: "100%", padding: "8px" }}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Update
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
};

export default EditDispatchReport;
