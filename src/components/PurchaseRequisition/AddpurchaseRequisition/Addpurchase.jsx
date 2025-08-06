import React, { useState, useEffect } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { createPurchaseRequisition } from "../../../services/db_manager";
// Import functions to fetch data from your API
// Assuming you have these functions in your services
import { fetchPartNumbersAndDescriptions } from "../../../services/db_manager";

const AddPurchaseRequisition = () => {
  // State for the current form being filled
  const [form, setForm] = useState({
    srNo: "",
    partNumber: "",
    description: "",
    currentStock: "",
    requiredQty: "",
    requiredDate: "",
    remark: "",
    unitOfMeasurement: "",
  });

  // State to store all the purchase requisitions added
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);

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
    srNo: {
      type: "number",
      length: 12,
    },
    partNumber: {
      length: 12,
    },
    description: {
      length: 255,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    currentStock: {
      type: "number",
      length: 10,
    },
    requiredQty: {
      type: "number",
      length: 10,
    },
    remark: {
      length: 255,
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

  // Add a new purchase requisition to the list
  const handleAddRequisition = (e) => {
    e.preventDefault();

    // Log all form field values to console
    console.log("Form values:", {
      srNo: form.srNo,
      partNumber: form.partNumber,
      description: form.description,
      currentStock: form.currentStock,
      requiredQty: form.requiredQty,
      requiredDate: form.requiredDate,
      remark: form.remark,
      unitOfMeasurement: form.unitOfMeasurement,
    });

    // Iterate through each field and validate
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        console.log(`Validation error for ${field}:`, error);
        alert(error);
        return;
      }
    }

    // Add the current form to the purchaseRequisitions array with a unique ID
    const newRequisition = {
      ...form,
      id: Date.now(), // Using timestamp as a simple unique ID
    };

    setPurchaseRequisitions([...purchaseRequisitions, newRequisition]);

    // Reset the form after adding to the list
    setForm({
      srNo: "",
      partNumber: "",
      description: "",
      currentStock: "",
      requiredQty: "",
      requiredDate: "",
      remark: "",
      unitOfMeasurement: "",
    });

    alert("Purchase Requisition added to the list!");
  };

  // Remove a purchase requisition from the list
  const handleRemoveRequisition = (id) => {
    setPurchaseRequisitions(
      purchaseRequisitions.filter((req) => req.id !== id)
    );
  };

  // Submit all purchase requisitions
  const handleSubmitAll = async () => {
    if (purchaseRequisitions.length === 0) {
      alert("No purchase requisitions to submit!");
      return;
    }

    try {
      // You can modify this to submit all requisitions at once if your API supports it
      // For now, we'll just show a success message
      alert(
        `${purchaseRequisitions.length} Purchase Requisitions ready to be submitted!`
      );
      // let newData=[...purchaseRequisitions]
      const requisitionsToSubmit = purchaseRequisitions.map((req) => ({
        srNo: req.srNo,
        partNumber: req.partNumber,
        description: req.description,
        currentStock: req.currentStock,
        requiredQty: req.requiredQty,
        requiredDate: req.requiredDate,
        remark: req.remark,
      }));
      // Uncomment below to actually submit each requisition to the API
      // for (const requisition of purchaseRequisitions) {
      await createPurchaseRequisition(requisitionsToSubmit);
      // }
      setPurchaseRequisitions([]);
      alert("All Purchase Requisitions submitted successfully!");
    } catch (error) {
      console.error("Error submitting purchase requisitions:", error);
      alert("Failed to submit purchase requisitions.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Purchase Requisition"
            isBack={true}
          />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ minHeight: "397px" }}
              >
                <div className="col-md-12">
                  <form
                    onSubmit={handleAddRequisition}
                    style={{ height: "100%" }}
                  >
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">Sr No</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="srNo"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.srNo}
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

                    <hr className="mx-0 my-2 p-0 border" />

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
                        <label className="col-md-4 mt-2">Current Stock</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="currentStock"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.currentStock}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Required Qty</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="requiredQty"
                          onInput={(event) => {
                            validateDataType(event, "N");
                          }}
                          value={form.requiredQty}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6 p-1 d-flex">
                      <label className="col-md-4 mt-2">Unit of Measurement</label>
                      <select
                        className="form-control w-100"
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


                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Required Date</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="requiredDate"
                          value={form.requiredDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Remark</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="remark"
                          onInput={(event) => {
                            validateDataType(event, "A");
                          }}
                          value={form.remark}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <button type="submit" className="btn btn-primary">
                        Add to List
                      </button>
                    </div>
                  </form>
                </div>
              </div>

              {/* Display the list of purchase requisitions */}
              {purchaseRequisitions.length > 0 && (
                <div className="row mx-1 card border border-dark shadow-lg py-2 mt-4">
                  <div className="col-md-12">
                    <h4 className="mt-3 mb-3">Purchase Requisitions List</h4>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>SR No</th>
                            <th>Part Number</th>
                            <th>Description</th>
                            <th>Current Stock</th>
                            <th>Required Qty</th>
                            <th>Required Date</th>
                            <th>Remark</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseRequisitions.map((req) => (
                            <tr key={req.id}>
                              <td>{req.srNo}</td>
                              <td>{req.partNumber}</td>
                              <td>{req.description}</td>
                              <td>{req.currentStock}</td>
                              <td>{req.requiredQty}</td>
                              <td>{req.requiredDate}</td>
                              <td>{req.remark}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() =>
                                    handleRemoveRequisition(req.id)
                                  }
                                >
                                  Remove
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="text-end mb-3">
                      <button
                        className="btn btn-success"
                        onClick={handleSubmitAll}
                      >
                        Submit All Requisitions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AddPurchaseRequisition;