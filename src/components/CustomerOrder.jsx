import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { addCustomerOrder } from "../services/db_manager";


const CustomerOrder= () => {
    const [roNo, setRoNo] = useState(''); 
    const [roReceiveDate, setRoReceiveDate] = useState(''); 
    const [customerName, setCustomerName] = useState(''); 
    const [partNo, setPartNo] = useState(''); 
    const [partDescription, setPartDescription] = useState(''); 
    const [quantity, setQuantity] = useState(''); 
    const [batchNo, setBatchNo] = useState(''); 
    const [srNo, setSrNo] = useState('');              
    const [status, setStatus] = useState('');          
    const [error, setError] = useState('');              // Error message
    const [formError, setFormError] = useState(''); // general error message
const [document, setDocument] = useState(null);
    const [success, setSuccess] = useState(''); 
  const [purchaseRequisitions, setPurchaseRequisitions] = useState([]);

  // Handle input changes for each field
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

  const formatDateToDDMMYYYY = (dateStr) => {
  if (!dateStr) return "";
  const [year, month, day] = dateStr.split("-");
  return `${day}-${month}-${year}`;
};
  const validateForm = () => {
    let newErrors = {};

    // Numeric fields validation
    if (!/^\d{1,50}$/.test(roNo))
      newErrors.roNo = "RO No must be a number (max 50 digits)";
    if (!/^\d{1,10}$/.test(quantity))
      newErrors.quantity = "Quantity must be a number (max 10 digits)";
    if (!/^\d{1,10}$/.test(batchNo))
      newErrors.batchNo = "Batch Number must be a number (max 10 digits)";
    if (!/^\d{1,20}$/.test(srNo))
      newErrors.srNo = "Sr. No. must be a number (max 20 digits)";

    // Alphanumeric fields validation
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(customerName))
      newErrors.customerName =
        "Customer Name must contain only alphabet and number (max 100 characters)";
    if (!/^[a-zA-Z0-9 ]{1,50}$/.test(partNo))
      newErrors.partNo =
        "Part No must be alphanumeric (max 50 characters)";
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(partDescription))
      newErrors.partDescription =
        "Part Description must be alphanumeric (max 100 characters)";

    // Required field validation
    if (!roReceiveDate) newErrors.roReceiveDate = "Ro Received Date is required";

    setError(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission to create a new role
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const token = sessionStorage.getItem("jwt_token");
  if (!token) {
  setFormError('You need to be logged in again');
    return;
  }
// Add the current form to the purchaseRequisitions array with a unique ID
    const newRequisition = {
  srNo,
  batchNo,
  roNo,
  roReceiveDate,
  customerName,
  partNo,
  partDescription,
  quantity,
  status,
  id: Date.now(),
  makerUserName: sessionStorage.getItem('username'),
  makerDate: new Date().toISOString().split('T')[0],
  userAction: "1",
  userRole: sessionStorage.getItem('roleId'),
};
    
    setPurchaseRequisitions([...purchaseRequisitions, newRequisition]);
    
    // Reset the form after adding to the list
    
      setRoNo('');
      setRoReceiveDate('');
      setCustomerName('');
      setPartNo('');
      setPartDescription('');
      setQuantity('');
      setSrNo('');
      setStatus('');
      setBatchNo('');
    
    
    alert("Customer Order added to the list!");
  };

  // Remove a purchase requisition from the list
  const handleRemoveRequisition = (id) => {
    setPurchaseRequisitions(purchaseRequisitions.filter(req => req.id !== id));
  };

  // Submit all purchase requisitions
  const handleSubmitAll = async () => {
     if (!document) return alert("Please upload the document.");
    if (purchaseRequisitions.length === 0) {
      alert("No Customer Order to submit!");
      return;
    }

    try {
      // For now, we'll just show a success message
      alert(`${purchaseRequisitions.length} Customer Order List ready to be submitted!`);
      // let newData=[...purchaseRequisitions]
      const requisitionsToSubmit = purchaseRequisitions.map(req => ({
        roNo : req.roNo,
        roReceiveDate : req.roReceiveDate,
        customerName : req.customerName,
        partNo : req.partNo,
        partDescription : req.partDescription,
        quantity : req.quantity,
        batchNo : req.batchNo,
        srNo : req.srNo,
        status : req.status,
        makerUserName: sessionStorage.getItem('username'),
        makerDate: new Date().toISOString().split('T')[0],
        userAction: "1",
        userRole: sessionStorage.getItem('roleId'),
      }));
      const formData = new FormData();
    formData.append("document", document);
    formData.append("orders", JSON.stringify(requisitionsToSubmit));
      await axiosInstance.post("/api/customerOrder/uploadWithOrders", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("All orders submitted successfully.");
      setPurchaseRequisitions([]);
      setDocument(null);
    } catch (error) {
      console.error("Error submitting Customer Order:", error);
      alert("Failed to submit Customer Order.");
    }
  };
  

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Add Customer Order"  isBack={true}/>
        <div className="my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 card border border-dark shadow-lg py-2" style={{height : '397px'}}>
              <div className="col-md-12">
                <form onSubmit={handleSubmit} style={{height : '100%'}}>

                <div className="col-md-12 p-3 d-flex">
                  <div className="col-md-6 p-2 d-flex">
                  <label className="col-md-4 mt-2">
                    Sr. No.
                  </label>
                  <input
                    className="form-control w-100"
                    type="text"
                    id="srNo"
                    name="srNo"
                    value={srNo}
                    onChange={(e) => handleInputChange(e, setSrNo)}
                    required
                  />
                  {error.srNo && <span className="text-danger">{error.srNo}</span>}

                  </div>
                  <div className="col-md-6 p-2 d-flex">
                  <label className="col-md-4 mt-2">
                    Batch Number
                  </label>
                  <input
                    className="form-control w-100"
                    type="text"
                    id="batchNo"
                    name="batchNo"
                    value={batchNo}
                    onChange={(e) => handleInputChange(e, setBatchNo)}
                    required
                  />
                  {error.batchNo && <span className="text-danger">{error.batchNo}</span>}

                  </div>
                  </div>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">

          <label className="col-md-4 mt-2">RO(Repair Order) No</label>
          <input
          className="form-control w-100"
            type="text"
            id="roNo"
            name="roNo"
            value={roNo}
            onChange={(e) => handleInputChange(e, setRoNo)}
            required
          />
          {error.roNo && <span className="text-danger">{error.roNo}</span>}

        </div>

        <div className="col-md-6 p-1 d-flex">
          <label className="col-md-4 mt-2" >RO Received Date</label>
            <input
            className="form-control w-100"
            type="date"
            id="roReceiveDate"
            name="roReceiveDate"
            value={roReceiveDate}
            onChange={(e) => handleInputChange(e, setRoReceiveDate)}
            required
            />
            {error.roReceiveDate && <span className="text-danger">{error.roReceiveDate}</span>}

        </div>
        </div>
        <div className="col-md-12 d-flex">
        <div className="col-md-6 p-1 d-flex">
            <label className="col-md-4 mt-2">Customer Name</label>
                <input
                className="form-control w-100"
                type="text"
                id="customerName"
                name="customerName"
                value={customerName}
                onChange={(e) => handleInputChange(e, setCustomerName)}
                required
                />
                {error.customerName && <span className="text-danger">{error.customerName}</span>}

        </div>
        <div className="col-md-6 p-1 d-flex">
            <label className="col-md-4 mt-2">Part No</label>
                <input
                className="form-control w-100"
                type="text"
                id="partNo"
                name="partNo"
                value={partNo}
                onChange={(e) => handleInputChange(e, setPartNo)}
                required
             />
             {error.partNo && <span className="text-danger">{error.partNo}</span>}

        </div>
        </div>

        <div className="col-md-12 p-3 d-flex">
        <div className="col-md-6 p-1 d-flex">
            <label className="col-md-2 mt-2">Part Description</label>
                <textarea
                className="form-control w-100"
                id="partDescription"
                name="partDescription"
                value={partDescription}
                onChange={(e) => handleInputChange(e, setPartDescription)}
                style={{ height: "70px" }}
                required
              ></textarea>
              {error.partDescription && <span className="text-danger">{error.partDescription}</span>}

        </div>
        </div>
        <div className="col-md-12 p-3 d-flex">

        <div className="col-md-6 p-2 d-flex">
                  <label className="col-md-4 mt-2">
                    Quantity
                  </label>
                  <input
                    className="form-control w-100"
                    type="text"
                    id="quantity"
                    name="quantity"
                    value={quantity}
                    onChange={(e) => handleInputChange(e, setQuantity)}                    
                    required
                  />
                  {error.quantity && <span className="text-danger">{error.quantity}</span>}

                </div>
                
                 
                <div className="col-md-6 p-2 d-flex">
                  <label className="col-md-4 mt-2">Status</label>
                      <select
                        className="form-control w-100"
                        id="status"
                        name="status"
                        value={status}
                        onChange={(e) => handleInputChange(e, setStatus)}
                        required
                      >
                        <option value="">Select</option>
                        <option value="open">Open</option>
                        <option value="inProgress">In-Progress</option>
                        <option value="closed">Closed</option>
                        <option value="reOpen">ReOpen</option>
                      </select>
                      {error.status && <span className="text-danger">{error.status}</span>}

                    </div>
                </div>
      

        <div className="col-md-12 text-right mt-1">
                      <div className="text-end m-0">
                    <button type="submit" className="btn btn-primary">Add List</button>
                    </div>
                  </div>
                </form>
                </div>
              </div>

           {/* Display the list of purchase requisitions */}
              {purchaseRequisitions.length > 0 && (
                <div className="row mx-1 card border border-dark shadow-lg py-2 mt-4">
                  <div className="col-md-12">
                    <h4 className="mt-3 mb-3">Customer Order List</h4>
                    <div className="table-responsive">
                      <table className="table table-striped table-bordered">
                        <thead>
                          <tr>
                            <th>SR No</th>
                            <th>Batch No.</th>
                            <th>RO. No.</th>
                            <th>RO Recevied Date</th>
                            <th>Customer Name</th>
                            <th>Part No.</th>
                            <th>Part Description</th>
                            <th>Quantity</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {purchaseRequisitions.map((req) => (
                            <tr key={req.id}>
                              <td>{req.srNo}</td>
                              <td>{req.batchNo}</td>
                              <td>{req.roNo}</td>
                              <td>{req.roReceiveDate}</td>
                              <td>{req.customerName}</td>
                              <td>{req.partNo}</td>
                              <td>{req.partDescription}</td>
                              <td>{req.quantity}</td>
                              <td>{req.status}</td>
                              <td>
                                <button
                                  className="btn btn-danger btn-sm"
                                  onClick={() => handleRemoveRequisition(req.id)}
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
                      <button 
                        className="btn btn-success"
                        onClick={handleSubmitAll}
                      >
                        Submit 
                      </button>
                    
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div >
  );
};

export default CustomerOrder;
