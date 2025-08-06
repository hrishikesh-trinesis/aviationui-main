import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
// import { createRequisition } from "../../../services/db_manager";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { createMaterialRequisition, fetchPartNumbersAndDescriptions } from "../../../services/db_manager";

const AddRequisition = () => {
  const [form, setForm] = useState({
    materialRequisitionNo: "",
    workOrderNo: "",
    date: "",
    partNumber: "",
    description: "",
    requestedQty: "",
    issueQty: "",
    issuedQty: "",
    batchLotNo: "",
    unitOfMeasurement: "",
  });

  // State to store dropdown options from API
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // Fetch data once on component mount
    useEffect(() => {
      const fetchData = async () => {
        setLoading(true);
        try {
          const response = await fetchPartNumbersAndDescriptions(); // replace with actual API call
          setData(response);
          setError(null);
        } catch (err) {
          console.error("API Error:", err);
          setError("Failed to load product data. Please try again.");
          // fallback data
          setData([
            { productName: "Sample A", productDescription: "Desc A" },
            { productName: "Sample B", productDescription: "Desc B" },
          ]);
        } finally {
          setLoading(false);
        }
      };
  
      fetchData();
    }, []);
  
    // Handle part number (productName) change
    const handleProductChange = (e) => {
      const selected = e.target.value;
      const match = data.find((item) => item.productName === selected);
  
      // Update form state with both partNumber and description
      setForm(prevForm => ({
        ...prevForm,
        partNumber: selected,
        description: match ? match.productDescription : ""
      }));
    };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Helper function to validate each field
  const validateField = (fieldName, value, rules) => {
    if (!value) return `${fieldName} is required.`;

    if (rules.type === "number" && isNaN(value)) {
      return `${fieldName} should be a number.`;
    }

    if (rules.length && value.length > rules.length) {
      return `${fieldName} should be at most ${rules.length} characters.`;
    }

    if (rules.regex && !rules.regex.test(value)) {
      return `${fieldName} has invalid characters.`;
    }

    return null; // No error
  };

  // Validation rules object
  const validationRules = {
    materialRequisitionNo: {
      type: "number",
      length: 12,
    },
    workOrderNo: {
      type: "number",
      length: 12,
    },
    partNumber: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    description: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    requestedQty: {
      type: "number",
      length: 10,
    },
    issueQty: {
      type: "number",
      length: 10,
    },
    issuedQty: {
      type: "number",
      length: 10,
    },
    batchLotNo: {
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
  };

  const validateDataType = (event, dataType) => {
    let value = event.target.value;
    if (dataType === "A") {
      value = value.replace(/[^a-zA-Z0-9 ]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "N") {
      value = value.replace(/[^0-9]/g, "");
      event.target.classList.add("is-valid");
    } else if (dataType === "ANS") {
      value = value.replace(/[^a-zA-Z0-9@.]/g, "");
      event.target.classList.add("is-valid");
    }

    event.target.value = value;
  };

  function validateLen(event, minLen, maxLen) {
    let value = event.target.value.substring(0, maxLen);
    event.target.value = value;
    let elementLen = value.length;
    if (elementLen > maxLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else if (elementLen < minLen) {
      event.target.classList.remove("is-valid");
      event.target.classList.add("is-invalid");
    } else {
      event.target.classList.add("is-valid");
      event.target.classList.remove("is-invalid");
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Iterate through each field and validate
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        alert(error);
        return;
      }
    }

    // If all validation passes, proceed with submitting
    try {
      const response = await createMaterialRequisition(form);
      console.log("Requisition added successfully:", response.data);
      alert("Requisition Added Successfully!");
      // location.reload();

      // Reset the form after successful submission
      setForm({
        materialRequisitionNo: "",
        workOrderNo: "",
        date: "",
        partNumber: "",
        description: "",
        requestedQty: "",
        issueQty: "",
        issuedQty: "",
        batchLotNo: "",
        unitOfMeasurement: "",
      });
    } catch (error) {
      console.error("Error adding requisition:", error);
      alert("Failed to add requisition.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Material Requisition"
            isBack={true}
          />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ height: "397px" }}
              >
                <div className="col-md-12">
                  <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">
                          Material Requisition No
                        </label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="materialRequisitionNo"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.materialRequisitionNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Workorder No</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="workOrderNo"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.workOrderNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Date</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="date"
                          value={form.date}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number</label>
                        {loading ? (
                          <div className="d-flex align-items-center">
                            <div
                              className="spinner-border text-primary me-2"
                              role="status"
                            >
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <span>Loading part numbers...</span>
                          </div>
                        ) : error ? (
                          <div className="alert alert-danger w-100">{error}</div>
                        ) : (
                          <select
                            className="form-select w-100"
                            name="partNumber"
                            value={form.partNumber}
                            onChange={handleProductChange}
                            required
                          >
                            <option value="">Select a part number</option>
                            {data.map((item, index) => (
                              <option key={index} value={item.productName}>
                                {item.productName}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    {/* Description Dropdown (Disabled and auto-selected) */}
                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Description</label>
                      {loading ? (
                        <div className="d-flex align-items-center">
                          <div
                            className="spinner-border text-primary me-2"
                            role="status"
                          >
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          <span>Loading descriptions...</span>
                        </div>
                      ) : error ? (
                        <div className="alert alert-danger w-100">{error}</div>
                      ) : (
                        <select
                          className="form-select w-100"
                          name="description"
                          value={form.description}
                          disabled
                        >
                          <option value="">
                            {form.description || "Auto-selected"}
                          </option>
                        </select>
                      )}
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Requested QTY</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="requestedQty"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.requestedQty}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Issue QTY</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="issueQty"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.issueQty}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Issued QTY</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="issuedQty"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.issuedQty}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Batch/LOT</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="batchLotNo"
                          onInput={(event) => {
                            validateDataType(event, "ANS");
                          }}
                          value={form.batchLotNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                        <div className="col-md-6 p-2 d-flex">
                          <label className="col-md-4 mt-2">Unit of Measurement</label>
                          <select
                            className="form-select w-100"
                            name="unitOfMeasurement"
                            value={form.unitOfMeasurement}
                            onChange={handleChange}
                            required
                          >
                            <option value="">Select Unit</option>
                            <option value="EA">EA</option>
                            <option value="RL">RL</option>
                            <option value="QT">QT</option>
                            <option value="GAL">GAL</option>
                            <option value="KIT">KIT</option>
                            <option value="LTR">LTR</option>
                            <option value="SHT">SHT</option>
                            <option value="Sq.ft">Sq.ft</option>
                            <option value="Sq.mtr">Sq.mtr</option>
                          </select>
                        </div>

                        <div className="col-md-6 p-2 d-flex text-end">
                          <div className="col-md-4 mt-2 text-end">
                            <button type="submit" className="btn btn-primary">
                          Add Requisition
                        </button>
                          </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddRequisition;
