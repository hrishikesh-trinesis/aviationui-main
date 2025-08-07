import { useEffect, useState } from "react";
import Header from "../../Header";
import Footer from "../../Footer";
import Sidebar from "../../Sidebar";
// import axiosInstance from "../axiosConfig";
// import { createWorkorder } from "../services/db_manager";
import CustomBreadcrumb from "../../Breadcrumb/CustomBreadcrumb";
import { useLocation } from "react-router-dom";
import { AddWorkOrder, getWorkOrder } from "../../../services/db_manager";
import { toast } from "react-toastify";

const AddWorkorder = () => {
  const location = useLocation();
  const { srNo } = location.state || "";

  // Define the initial form structure with default workDetails - Updated to match API
  const getInitialFormState = () => ({
    // Main fields mapped to API
    issueDate: "",
    customerName: "",
    repairOrderNo: "",
    partNumber: "",
    qty: "",
    description: "",
    cmmRefNo: "",
    revNo: "",
    workshopManagerRemarks: "",
    issuedBy: "",
    certifyingStaffhours: "",
    technician: "",
    totalManHour: "",
    actionTaken: "",
    toolsUsed: "",
    qualityManagerSignDate: "",
    workshopManagerSignDate: "",
    snBn: "",

    // Work Order Steps Section (mapped from workDetails)
    workOrderSteps: [
      {
        stepNo: 1,
        detailOfWorkDone:
          "Incoming Inspection:\na) Carry out Visual Inspection of the unit at the time if receipt for\nphysical damage, missing parts, documentents and any other\naspect\nb) Report any discrepancy noticed to shop QC for further action\nand Disposition.\nc) Check SB Compliance\nRecord TSN:--                    CSN:--",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 2,
        detailOfWorkDone: "Test unit to confirm the defect as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 3,
        detailOfWorkDone: "Disassembly as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 4,
        detailOfWorkDone: "Cleaning as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 5,
        detailOfWorkDone: "Inspection/Check as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 6,
        detailOfWorkDone: "Trouble-shooting as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 7,
        detailOfWorkDone: "Repair as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 8,
        detailOfWorkDone: "Assembly as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 9,
        detailOfWorkDone: "Test unit as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 10,
        detailOfWorkDone: "Fit and Clearance as per CMM",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 11,
        detailOfWorkDone: "Final Inspection",
        technicianSign: "",
        certifyingStaffSign: "",
      },
      {
        stepNo: 12,
        detailOfWorkDone: "Actual",
        technicianSign: "",
        certifyingStaffSign: "",
      },
    ],

    // Material Requisitions Section (mapped from partsUsed)
    materialRequisitions: [
      {
        srNo: 101,
        description: "",
        partNo: "",
        snbn: "",
        qty: "",
        remarks: "Main part from order",
      },
    ],

    // Additional fields for UI compatibility
    toolsTextBox1: "",
    toolsTextBox2: "",
  });

  const [form, setForm] = useState(getInitialFormState());

  const fetchPurchaseOrder = async () => {
    try {
      const response = await getWorkOrder(srNo);
      if (response) {
        // Create material requisition from main part data
        const mainPartMaterialRequisition = {
          srNo: 101,
          description: response.partDesc || "",
          partNo: response.partNo || "",
          snbn: "",
          qty: response.qty || "",
          remarks: "",
        };

        // Map response data to match the new field names
        const formattedData = {
          ...form, // Keep existing form structure
          customerName: response.customerName,
          repairOrderNo: response.orderNo || response.repairOrderNo,
          description: response.partDesc || response.description,
          partNumber: response.partNo || response.partNumber,
          qty: response.qty,
          // Ensure workOrderSteps are preserved
          workOrderSteps:
            response.workOrderSteps ||
            response.workDetails ||
            form.workOrderSteps,
          // Sync main part data to materialRequisitions and preserve existing ones
          materialRequisitions: response.materialRequisitions ||
            response.partsUsed || [mainPartMaterialRequisition],
          // Map other fields
          issueDate: response.date || response.issueDate,
          cmmRefNo: response.cmmRefNo,
          snBn: response.snBin || response.snBn,
          revNo: response.revisionNo || response.revNo,
          workshopManagerRemarks:
            response.remarks || response.workshopManagerRemarks,
          issuedBy: response.issuedByWorkshopManagerName || response.issuedBy,
          certifyingStaffhours: response.workshopManager || response.certifyingStaffhours,
        };

        setForm(formattedData);
      }
    } catch (error) {
      console.error("Error fetching Purchase order details:", error);
      alert("Error fetching Purchase order details.");
    }
  };

  useEffect(() => {
    if (srNo) {
      fetchPurchaseOrder();
    }
  }, [srNo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleWorkOrderStepChange = (index, field, value) => {
    const updatedWorkOrderSteps = [...form.workOrderSteps];
    updatedWorkOrderSteps[index][field] = value;
    setForm({ ...form, workOrderSteps: updatedWorkOrderSteps });
  };

  const handleMaterialRequisitionChange = (index, field, value) => {
    const updatedMaterialRequisitions = [...form.materialRequisitions];
    updatedMaterialRequisitions[index][field] = value;
    setForm({ ...form, materialRequisitions: updatedMaterialRequisitions });
  };

  const addMaterialRequisitionRow = () => {
    const newSrNo =
      Math.max(...form.materialRequisitions.map((item) => item.srNo || 0)) + 1;
    setForm({
      ...form,
      materialRequisitions: [
        ...form.materialRequisitions,
        {
          srNo: newSrNo,
          description: "",
          partNo: "",
          snbn: "",
          qty: "",
          remarks: "",
        },
      ],
    });
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

  // Updated validation rules to match new field names
  const validationRules = {
    repairOrderNo: {
      length: 20,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    customerName: {
      length: 200,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    partNumber: {
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    description: {
      length: 200,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    qty: {
      type: "number",
      length: 20,
    },
    cmmRefNo: {
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    snBn: {
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    revNo: {
      length: 50,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    certifyingStaffhours: {
      type:"number",
      length: 50,
      // regex: /^[a-zA-Z\s]*$/,
    },
    workshopManagerRemarks: {
      length: 500,
      regex: /^[a-zA-Z0-9\s]*$/,
    },
    issuedBy: {
      length: 50,
      regex: /^[a-zA-Z\s]*$/,
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

    // Create the payload with proper structure
    const payload = {
      issueDate: form.issueDate,
      customerName: form.customerName,
      repairOrderNo: form.repairOrderNo,
      partNumber: form.partNumber,
      qty: parseInt(form.qty) || 0, // Ensure it's a number
      description: form.description,
      cmmRefNo: form.cmmRefNo,
      revNo: form.revNo,
      workshopManagerRemarks: form.workshopManagerRemarks,
      issuedBy: form.issuedBy,
      certifyingStaffhours: form.certifyingStaffhours,
      technician: form.technician,
      totalManHour: form.totalManHour,
      actionTaken: form.actionTaken,
      toolsUsed: form.toolsTextBox1 || "", // Map toolsTextBox1 to toolsUsed
      qualityManagerSignDate: form.qualityManagerSignDate,
      workshopManagerSignDate: form.workshopManagerSignDate,
      snBn: form.snBn,
      workOrderSteps: form.workOrderSteps.map((step) => ({
        stepNo: step.stepNo,
        detailOfWorkDone: step.detailOfWorkDone,
        technicianSign: step.technicianSign,
        certifyingStaffSign: step.certifyingStaffSign,
      })),
      materialRequisitions: form.materialRequisitions.map((material) => ({
        srNo: material.srNo,
        description: material.description,
        partNo: material.partNo,
        snbn: material.snbn,
        qty: parseInt(material.qty) || 0, // Ensure it's a number
        remarks: material.remarks,
      })),
    };

    // Log the payload for debugging
    console.log("Payload being sent:", JSON.stringify(payload, null, 2));

    // If all validation passes, proceed with submitting
    try {
      const response = await AddWorkOrder(payload);
      console.log("Work order added successfully:", response.data);
      toast.success("Work Order Added Successfully!");
      // window.location.reload();

      // Reset the form after successful submission
      // setForm(getInitialFormState());
    } catch (error) {
      console.error("Error adding work order:", error);
      alert("Failed to add work order.");
    }
  };

  // Add safety check for rendering
  if (!form.workOrderSteps || !Array.isArray(form.workOrderSteps)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Add Work Order" isBack={true} />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ minHeight: "800px" }}
              >
                <div className="col-md-12">
                  <form onSubmit={handleSubmit} style={{ height: "100%" }}>
                    {/* First Row */}
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Repair Order</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="repairOrderNo"
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          value={form.repairOrderNo}
                          onChange={handleChange}
                          placeholder="Auto Generated"
                          required
                          disabled
                        />
                      </div>
                    </div>

                    {/* Second Row */}
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-1">Customer Name</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="customerName"
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 200);
                          }}
                          value={form.customerName}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="partNumber"
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          value={form.partNumber}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    {/* Description Row */}
                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Description</label>
                      <textarea
                        className="form-control w-100"
                        name="description"
                        value={form.description}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 200);
                        }}
                        onChange={handleChange}
                        style={{ height: "70px" }}
                        required
                        disabled
                      ></textarea>
                    </div>

                    {/* Third Row */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-1 d-flex">
                        <label className="col-md-4 mt-2">Quantity</label>
                        <input
                          className="form-control w-100"
                          type="number"
                          name="qty"
                          onInput={(event) => {
                            validateLen(event, 1, 20);
                          }}
                          value={form.qty}
                          onChange={handleChange}
                          required
                          disabled
                        />
                      </div>
                      <div className="col-md-6 d-flex">
                        <label className="col-md-4 mt-2">CMM Ref No</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="cmmRefNo"
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          value={form.cmmRefNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Fourth Row */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">SNBN</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="snBn"
                          value={form.snBn}
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Revision No</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="revNo"
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          value={form.revNo}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Fifth Row */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Issue Date</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="issueDate"
                          value={form.issueDate}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">
                          Certifying Staff
                        </label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="certifyingStaffhours"
                          value={form.certifyingStaffhours}
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Additional Fields Row */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Technician</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="technician"
                          value={form.technician}
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Total Man Hour</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="totalManHour"
                          value={form.totalManHour}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Remarks Row */}
                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">
                        Workshop Manager Remarks
                      </label>
                      <textarea
                        className="form-control w-100"
                        name="workshopManagerRemarks"
                        value={form.workshopManagerRemarks}
                        onInput={(event) => {
                          validateDataType(event, "A");
                          validateLen(event, 1, 500);
                        }}
                        onChange={handleChange}
                        style={{ height: "60px" }}
                        required
                      ></textarea>
                    </div>

                    {/* Last Row */}
                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Issued By</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="issuedBy"
                          value={form.issuedBy}
                          onInput={(event) => {
                            validateDataType(event, "A");
                            validateLen(event, 1, 50);
                          }}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Action Taken</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="actionTaken"
                          value={form.actionTaken}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    {/* Work Order Steps Section */}
                    <hr className="mx-0 my-2 p-0 border" />
                    <div className="col-md-12 p-2">
                      <h6 className="mb-3">Work Order Steps</h6>
                      <div className="table-responsive">
                        <table className="table table-bordered table-sm">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: "5%" }}>Step No</th>
                              <th style={{ width: "50%" }}>
                                Detail of work done
                              </th>
                              <th style={{ width: "15%" }}>Technician Sign</th>
                              <th style={{ width: "15%" }}>
                                Certifying Staff Sign
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {form.workOrderSteps.map((step, index) => (
                              <tr key={index}>
                                <td className="text-center">{step.stepNo}</td>
                                <td>
                                  <textarea
                                    className="form-control form-control-sm"
                                    style={{
                                      height:
                                        step.stepNo === 1 ? "120px" : "60px",
                                      fontSize: "12px",
                                    }}
                                    value={step.detailOfWorkDone}
                                    onChange={(e) =>
                                      handleWorkOrderStepChange(
                                        index,
                                        "detailOfWorkDone",
                                        e.target.value
                                      )
                                    }
                                    readOnly={step.stepNo !== 12}
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Text box"
                                    value={step.technicianSign}
                                    onChange={(e) =>
                                      handleWorkOrderStepChange(
                                        index,
                                        "technicianSign",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                                <td>
                                  <input
                                    type="text"
                                    className="form-control form-control-sm"
                                    placeholder="Text box"
                                    value={step.certifyingStaffSign}
                                    onChange={(e) =>
                                      handleWorkOrderStepChange(
                                        index,
                                        "certifyingStaffSign",
                                        e.target.value
                                      )
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Signature Dates Section */}
                    <hr className="mx-0 my-2 p-0 border" />
                    <div className="col-md-12 p-2">
                      <div className="row">
                        <div className="col-md-6">
                          <label className="form-label">
                            Quality Manager Sign Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="qualityManagerSignDate"
                            value={form.qualityManagerSignDate}
                            onChange={handleChange}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Workshop Manager Sign Date
                          </label>
                          <input
                            type="date"
                            className="form-control"
                            name="workshopManagerSignDate"
                            value={form.workshopManagerSignDate}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Material Requisitions Section */}
                    <hr className="mx-0 my-2 p-0 border" />
                    <div className="col-md-12 p-2">
                      {/* <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Material Requisitions</h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={addMaterialRequisitionRow}
                        >
                          Add Row
                        </button>
                      </div> */}
                      <div className="table-responsive">
                        <table className="table table-bordered table-sm">
                          <thead className="table-light">
                            <tr>
                              <th style={{ width: "5%" }}>Sr.No</th>
                              <th style={{ width: "30%" }}>Description</th>
                              <th style={{ width: "20%" }}>Part No</th>
                              <th style={{ width: "15%" }}>S.N,B.N</th>
                              <th style={{ width: "10%" }}>Qty</th>
                              <th style={{ width: "15%" }}>Remarks</th>
                              {/* <th style={{ width: "5%" }}>Action</th> */}
                            </tr>
                          </thead>
                          <tbody>
                            {form.materialRequisitions.map(
                              (material, index) => (
                                <tr key={index}>
                                  <td className="text-center">
                                    {material.srNo}
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={material.description}
                                      onChange={(e) =>
                                        handleMaterialRequisitionChange(
                                          index,
                                          "description",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={material.partNo}
                                      onChange={(e) =>
                                        handleMaterialRequisitionChange(
                                          index,
                                          "partNo",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={material.snbn}
                                      onChange={(e) =>
                                        handleMaterialRequisitionChange(
                                          index,
                                          "snbn",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={material.qty}
                                      onChange={(e) =>
                                        handleMaterialRequisitionChange(
                                          index,
                                          "qty",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="text"
                                      className="form-control form-control-sm"
                                      value={material.remarks}
                                      onChange={(e) =>
                                        handleMaterialRequisitionChange(
                                          index,
                                          "remarks",
                                          e.target.value
                                        )
                                      }
                                    />
                                  </td>
                                  {/* <td>
                                    {form.materialRequisitions.length > 1 && (
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          removeMaterialRequisitionRow(index)
                                        }
                                      >
                                        ×
                                      </button>
                                    )}
                                  </td> */}
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Tools Section */}
                    <hr className="mx-0 my-2 p-0 border" />
                    <div className="col-md-12 p-2">
                      <div className="row">
                        <div className="col-md-4">
                          <label className="form-label">Tools Used</label>
                          <input
                            type="text"
                            className="form-control"
                            name="toolsTextBox1"
                            value={form.toolsTextBox1}
                            onChange={handleChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <button type="submit" className="btn btn-primary">
                        Add Work Order
                      </button>
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

export default AddWorkorder;
