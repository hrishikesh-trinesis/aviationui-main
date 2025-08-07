import { useEffect, useState } from "react";
import Header from "../Header";
import Footer from "../Footer";
import Sidebar from "../Sidebar";
import CustomBreadcrumb from "../Breadcrumb/CustomBreadcrumb";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getWorkOrderDetails, updateWorkOrder } from "../../services/db_manager";
import { toast } from "react-toastify";

const EditWorkorder = () => {
  const location = useLocation();
  const params = useParams();
    const navigate = useNavigate();

  // Get work order number from URL params or location state
  const workOrderNo = params.workOrderNo || location.state?.workOrderNo || "";

  // Define the initial form structure
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

    // Work Order Steps Section
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

    // Material Requisitions Section
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
  const [loading, setLoading] = useState(true);
  const [originalData, setOriginalData] = useState(null);

  // Fetch work order data based on work order number
  const fetchWorkOrderData = async () => {
    if (!workOrderNo) {
      toast.error("Work Order Number is required");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await getWorkOrderDetails(workOrderNo);
      
      if (response) {
        // Store original data for comparison
        setOriginalData(response);

        // Create material requisition from main part data if needed
        const mainPartMaterialRequisition = {
          srNo: 101,
          description: response.partDesc || response.description || "",
          partNo: response.partNo || response.partNumber || "",
          snbn: response.snBin || response.snBn || "",
          qty: response.qty || "",
          remarks: response.remarks || "Main part from order",
        };

        // Map response data to form structure
        const formattedData = {
          ...form, // Keep existing form structure
          customerName: response.customerName || "",
          repairOrderNo: response.orderNo || response.repairOrderNo || "",
          description: response.partDesc || response.description || "",
          partNumber: response.partNo || response.partNumber || "",
          qty: response.qty || "",
          issueDate: response.date || response.issueDate || "",
          cmmRefNo: response.cmmRefNo || "",
          snBn: response.snBin || response.snBn || "",
          revNo: response.revisionNo || response.revNo || "",
          workshopManagerRemarks: response.remarks || response.workshopManagerRemarks || "",
          issuedBy: response.issuedByWorkshopManagerName || response.issuedBy || "",
          certifyingStaffhours: response.workshopManager || response.certifyingStaffhours || "",
          technician: response.technician || "",
          totalManHour: response.totalManHour || "",
          actionTaken: response.actionTaken || "",
          toolsUsed: response.toolsUsed || "",
          qualityManagerSignDate: response.qualityManagerSignDate || "",
          workshopManagerSignDate: response.workshopManagerSignDate || "",
          
          // Preserve work order steps from API or use defaults
          workOrderSteps: response.workOrderSteps || response.workDetails || form.workOrderSteps,
          
          // Handle material requisitions
          materialRequisitions: response.materialRequisitions || response.partsUsed || [mainPartMaterialRequisition],
          
          // Map tools fields
          toolsTextBox1: response.toolsUsed || "",
        };

        setForm(formattedData);
        toast.success("Work Order data loaded successfully!");
      } else {
        toast.error("Work Order not found");
      }
    } catch (error) {
      console.error("Error fetching work order details:", error);
      toast.error("Error fetching work order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (workOrderNo) {
      fetchWorkOrderData();
    } else {
      setLoading(false);
      toast.error("Work Order Number is missing");
    }
  }, [workOrderNo]);

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

  const removeMaterialRequisitionRow = (index) => {
    const updatedMaterialRequisitions = form.materialRequisitions.filter(
      (_, i) => i !== index
    );
    setForm({ ...form, materialRequisitions: updatedMaterialRequisitions });
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

  // Validation rules
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
      type: "number",
      length: 50,
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

    // Validate form fields
    for (const [field, rules] of Object.entries(validationRules)) {
      const error = validateField(field, form[field], rules);
      if (error) {
        toast.error(error);
        return;
      }
    }

    // Create the payload for PUT request
    const payload = {
      workOrderNo: workOrderNo, // Include work order number for identification
      issueDate: form.issueDate,
      customerName: form.customerName,
      repairOrderNo: form.repairOrderNo,
      partNumber: form.partNumber,
      qty: parseInt(form.qty) || 0,
      description: form.description,
      cmmRefNo: form.cmmRefNo,
      revNo: form.revNo,
      workshopManagerRemarks: form.workshopManagerRemarks,
      issuedBy: form.issuedBy,
      certifyingStaffhours: form.certifyingStaffhours,
      technician: form.technician,
      totalManHour: form.totalManHour,
      actionTaken: form.actionTaken,
      toolsUsed: form.toolsTextBox1 || form.toolsUsed,
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
        qty: parseInt(material.qty) || 0,
        remarks: material.remarks,
      })),
    };

    // Log the payload for debugging
    console.log("PUT Payload being sent:", JSON.stringify(payload, null, 2));

    try {
      const response = await updateWorkOrder(workOrderNo, payload);
      console.log("Work order updated successfully:", response.data);
      toast.success("Work Order Updated Successfully!");
          navigate(-1)

    } catch (error) {
      console.error("Error updating work order:", error);
      toast.error("Failed to update work order");
    }
  };

  // Show loading state while fetching data
  if (loading) {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb breadcrumbsLabel="Edit Work Order" isBack={true} />
            <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <span className="ms-3">Loading Work Order Data...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Add safety check for rendering
  if (!form.workOrderSteps || !Array.isArray(form.workOrderSteps)) {
    return (
      <div className="wrapper">
        <Sidebar />
        <div className="content">
          <Header />
          <div style={{ marginTop: "10px" }}>
            <CustomBreadcrumb breadcrumbsLabel="Edit Work Order" isBack={true} />
            <div className="alert alert-danger m-3">
              Error loading work order data. Please try again.
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb breadcrumbsLabel="Edit Work Order" isBack={true} />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ minHeight: "800px" }}
              >
                <div className="col-md-12">
                  {/* Work Order Number Display */}
                  <div className="alert alert-info mb-3">
                    <strong>Editing Work Order: {workOrderNo}</strong>
                  </div>

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
                          placeholder="Repair Order Number"
                          required
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
                                    placeholder="Technician signature"
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
                                    placeholder="Staff signature"
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
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <h6>Material Requisitions</h6>
                        <button
                          type="button"
                          className="btn btn-sm btn-success"
                          onClick={addMaterialRequisitionRow}
                        >
                          Add Row
                        </button>
                      </div>
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
                              <th style={{ width: "5%" }}>Action</th>
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
                                  <td>
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
                                  </td>
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

                    {/* Submit Button */}
                    <div className="col-md-12 text-end m-1 p-4 text-right">
                      <div className="d-flex gap-2 justify-content-end">
                        <button 
                          type="button" 
                          className="btn btn-secondary"
                          onClick={() => window.history.back()}
                        >
                          Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                          Update Work Order
                        </button>
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

export default EditWorkorder;