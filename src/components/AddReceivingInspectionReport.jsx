import React, { useEffect, useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
//import { fetchPartNumbers } from "../services/db_manager";
import {fetchPartDetails,submitInspectionReport,fetchPartNumbers} from "../services/db_manager";

const AddReceivingInspectionReport = () => {
  const [partNumbers, setPartNumbers] = useState([]);
  const [partLoading, setPartLoading] = useState(false);
  const [partError, setPartError] = useState(null);
  const [selectedPart, setSelectedPart] = useState("");
  const [document, setDocument] = useState(null);
  const [partDetails, setPartDetails] = useState({
  partDesc: "",
  supplierName: "",
  purchaseOrderNo: "",
  reportNo: "",
  date: "",
  qty: ""
});
  // Variables
 const [form, setForm] = useState({
    partNumber: "",
    partDesc: "",
    purchaseOrderNo: "",
    supplierName: "",
    reportNo: "",
    date: "",
    qty: "",
    qtyReceive: "",
    invoiceObservation: "",
    manufacturerCertObservation: "",
    supplierCertObservation: "",
    fullTraceabilityObservation: "",
    batchNumberObservation: "",
    dateOfManufacturingObservation: "",
    dateOfExpiryObservation: "",
    selfLifeObservation: "",
    tdsObservation: "",
    materialConditionObservation: "",
    specificationObservation: "",
    documentObservation: "",
    lotAccepted: "",
    remark: "",
    makerUserName: "",
    makerUserId: "",
    makerDate: "",
    checkerUserName: "",
    checkerUserId: "",
    checkerDate: "",
    userAction: "",
    userRole: "",
  });
   const [errors, setErrors] = useState({});
   // Fetch part numbers from API when component mounts
     useEffect(() => {
       const getPartNumbers = async () => {
         setPartLoading(true);
         try {
           const res = await fetchPartNumbers();
           console.log("Role data:", res.data);
          const actualData = res.data.data || res.data; 
           setPartNumbers(actualData);
         } catch (err) {
           console.error("Error fetching part numbers:", err);
           setPartError("Failed to load part numbers. Please try again later.");
         } finally {
           setPartLoading(false);
         }
       };
       
       getPartNumbers();
     }, []);

  const handleChange = (e) => {
      const { name, value } = e.target;
      setForm((prevForm) => ({
        ...prevForm,
        [name]: value,
      }));
    };
    const handlePartNumberSelect = async (partNumber) => {
      setSelectedPart(partNumber);
      if (!partNumber) return;
    
      try {
        const res = await fetchPartDetails(partNumber);
        setPartDetails(res.data);
      } catch (err) {
        console.error("Failed to fetch part details:", err);
      }
    };
    const handleAddInspectionReport = async (e) => {
      e.preventDefault();
      //if (!validateForm()) return;
 if (!document) return alert("Please upload the document.");
  const payload = {
    partNumber: selectedPart,
    partDesc: partDetails.partDesc,
    purchaseOrderNo: partDetails.purchaseOrderNo,
    supplierName: partDetails.supplierName,
    reportNo: partDetails.reportNo,
    date: partDetails.date,
    qty: partDetails.qty,
    qtyReceive: form.qtyReceive,
    invoiceObservation: form.invoiceObservation,
    manufacturerCertObservation: form.manufacturerCertObservation,
    dateOfExpiryObservation: form.dateOfExpiryObservation,
    supplierCertObservation: form.supplierCertObservation,
    fullTraceabilityObservation: form.fullTraceabilityObservation,
    batchNumberObservation: form.batchNumberObservation,
    dateOfManufacturingObservation: form.dateOfManufacturingObservation,
    selfLifeObservation: form.selfLifeObservation,
    tdsObservation: form.tdsObservation,
    materialConditionObservation: form.materialConditionObservation,
    specificationObservation: form.specificationObservation,
    documentObservation: form.documentObservation,
    lotAccepted: form.lotAccepted,
    remark: form.remark,
    makerUserName: sessionStorage.getItem('username'),
    makerUserId: "",
    makerDate: new Date().toISOString().split('T')[0],
    checkerUserName: "",
    checkerUserId: "",
    checkerDate: "",
    userAction: "1",
    userRole: sessionStorage.getItem('roleId'),
  };
  const formData = new FormData();
    formData.append("document", document);
    formData.append("report", JSON.stringify(payload));
  try {
    const response = await submitInspectionReport(formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    console.log("Report submitted successfully:", response.data);
    alert("Report submitted successfully");
    // reset form if needed
  } catch (err) {
    console.error("Submission failed", err);
    alert("Failed to submit report");
  }
    };

  // ######################################### HOOK #######################################

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Receiving Inspection Report Form"
                        isBack={true}
          />

          <div className="my-2 p-2">
            <div className="container-fluid">
              <div
                className="row mx-1 card border border-dark shadow-lg py-2"
                style={{ minHeight: "397px" }}
              >
                <div className="col-md-12">
                  <form onSubmit={handleAddInspectionReport} style={{ height: "100%" }}>
                    <div className="col-md-12 p-2 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Part Number</label>
                        {partLoading ? (
                          <div className="d-flex align-items-center">
                            <div className="spinner-border text-primary me-2" role="status">
                              <span className="visually-hidden">Loading...</span>
                            </div>
                            <span>Loading part numbers...</span>
                          </div>
                        ) : partError ? (
                          <div className="alert alert-danger w-100">
                            {partError}
                          </div>
                        ) : (
                          <select
                            className="form-select w-100"
                            name="partNumber"
                            onChange={(e) => handlePartNumberSelect(e.target.value)}
                            value={selectedPart}
                            required
                          >
                            <option value="">Select a part number</option>
                            {Array.isArray(partNumbers) && partNumbers.map((part) => (
                            <option key={part.partNumber} value={part.partNumber}>
                            {part.partNumber}
                            </option>
                            ))}
                          </select>
                        )}
                      </div>
                    </div>

                    <hr className="mx-0 my-2 p-0 border" />

                    <div className="col-md-12 p-3 d-flex">
                      <label className="col-md-2 mt-2">Part Description</label>
                      <input
                          className="form-control w-100"
                          type="text"
                          name="partDesc"
                          value={partDetails.partDesc}
                          onChange={handleChange}
                          disabled
                        />
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Purchase Order No.</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="purchaseOrderNo"
                          value={partDetails.purchaseOrderNo}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Supplier Name</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="supplierName"
                          value={partDetails.supplierName}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                    </div>

                    <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Report No.</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="reportNo"
                          value={partDetails.reportNo}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Date</label>
                        <input
                          className="form-control w-100"
                          type="date"
                          name="date"
                          value={partDetails.date}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      </div>
                      <div className="col-md-12 d-flex">
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Qty</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="qty"
                          value={partDetails.qty}
                          onChange={handleChange}
                          disabled
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Receive Qty</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="qtyReceive"
                          value={form.qtyReceive}
                          onChange={handleChange}
                          
                        />
                      </div>
                      </div>

                      <div className="row mx-1 card border border-dark shadow-lg py-2 mt-4">
                  <div className="col-md-12">
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>SR No</th>
                            <th>Check List</th>
                            <th>Requirements</th>
                            <th> Observation</th>
                          </tr>
                        </thead>
                        <tbody>
                            <tr>
                              <td>1</td>
                              <td>Invoice</td>
                              <td>Quantity and Unit Price must match with Purchase Order</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="invoiceObservation"
                          value={form.invoiceObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                              <td>2</td>
                              <td>Manufacturer Certificate</td>
                              <td>COC must available</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="manufacturerCertObservation"
                          value={form.manufacturerCertObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                              <td>3</td>
                              <td>Supplier Certificate(Distributor/Third Party)</td>
                              <td>COC must available, in case "No" direct supply from Mfg.</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="supplierCertObservation"
                          value={form.supplierCertObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                              <td>4</td>
                              <td>Certificate Full Traceability</td>
                              <td>Must Available</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="fullTraceabilityObservation"
                          value={form.fullTraceabilityObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                              <td>5</td>
                              <td>Batch Number</td>
                              <td>Must match(Physical Unit lable & all COC)</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="batchNumberObservation"
                          value={form.batchNumberObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                              <td>6</td>
                              <td>Date of Manufacturing(If Applicable)</td>
                              <td>Must match(Physical Unit lable & all COC)</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="dateOfManufacturingObservation"
                          value={form.dateOfManufacturingObservation}
                          onChange={handleChange}
                          placeholder="Enter Date in 'YYYY-mm-DD' format"
                          required
                        /></td>
                            </tr>
                            <tr>
                              <td>7</td>
                              <td>Date of Expiry(If Applicable)</td>
                              <td>Must match(Physical Unit lable & all COC)</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="dateOfExpiryObservation"
                          value={form.dateOfExpiryObservation}
                          onChange={handleChange}
                          placeholder="Enter Date in 'YYYY-mm-DD' format"
                          required
                        /></td>
                            </tr>

                            <tr>
                              <td>8</td>
                              <td>Shelf Life(If Applicable)</td>
                              <td>80% and above</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="selfLifeObservation"
                          value={form.selfLifeObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>

                            <tr>
                              <td>9</td>
                              <td>Technical Data Sheet(TDS) & MSDS</td>
                              <td>Must Available</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="tdsObservation"
                          value={form.tdsObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>

                            <tr>
                              <td>10</td>
                              <td>Material Condition</td>
                              <td>No Damage / No Leakage</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="materialConditionObservation"
                          value={form.materialConditionObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                            <td>11</td>
                              <td>Specification(If any)</td>
                              <td>Must Match with Purchase Order Specification</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="specificationObservation"
                          value={form.specificationObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                            <tr>
                            <td>12</td>
                              <td>Documents(If Import)</td>
                              <td>Air Way Bill(AWB) & Bill Of Entry(If Available)</td>
                              <td><input
                          className="form-control w-100"
                          type="text"
                          name="documentObservation"
                          value={form.documentObservation}
                          onChange={handleChange}
                          required
                        /></td>
                            </tr>
                        </tbody>
                      </table>
                    </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">LOT Accepted(Yes/No/With Deviation)</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="lotAccepted"
                          value={form.lotAccepted}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="col-md-6 p-2 d-flex">
                        <label className="col-md-4 mt-2">Remark(If any)</label>
                        <input
                          className="form-control w-100"
                          type="text"
                          name="remark"
                          value={form.remark}
                          onChange={handleChange}
                          required
                        />
                      </div>
                      <div className="text-end mb-3">
                      <label >
                    Upload Documents
                    </label>
                      <input
                    className="form-control w-100 p-0"
                    type="file"
                    id="document"
                    name="document"
                    onChange={(e) => setDocument(e.target.files[0])}
                
                    />
                       {document && <div className="mt-1"><small>Uploaded: {document.name}</small></div>}
                    </div>
                    </div>
                  </div>
                    <div className="text-end mb-3">
                      <button 
                        className="btn btn-success"

                      >
                        Submit
                      </button>
                    </div>
                      
                  </form>
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

export default AddReceivingInspectionReport;