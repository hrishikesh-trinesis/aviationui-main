import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { updateOrder } from "../services/db_manager";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";


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
   const location = useLocation();
  const { reportId ,reportData } = location.state || "";
  const navigate = useNavigate();
const [form, setForm] = useState({
  srNo: "",
  batchNo: "",
  roNo: "",
  roReceiveDate: "",
  customerName: "",
  partNo: "",
  partDescription: "",
  quantity: "",
  status: "",
});
useEffect(() => {
      
      if (reportData && reportId) {
        setForm((prevData) => ({
          ...prevData,
          ...reportData, 
        }));
      }
    }, [reportData, reportId]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Handle input changes for each field
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };

 
  const validateForm = () => {
    let newErrors = {};

    // Numeric fields validation
    if (!/^\d{1,50}$/.test(form.roNo))
      newErrors.roNo = "RO No must be a number (max 50 digits)";
    if (!/^\d{1,10}$/.test(form.quantity))
      newErrors.quantity = "Quantity must be a number (max 10 digits)";
    if (!/^\d{1,10}$/.test(form.batchNo))
      newErrors.batchNo = "Batch Number must be a number (max 10 digits)";
    if (!/^\d{1,20}$/.test(form.srNo))
      newErrors.srNo = "Sr. No. must be a number (max 20 digits)";

    // Alphanumeric fields validation
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(form.customerName))
      newErrors.customerName =
        "Customer Name must contain only alphabet and number (max 100 characters)";
    if (!/^[a-zA-Z0-9 ]{1,50}$/.test(form.partNo))
      newErrors.partNo =
        "Part No must be alphanumeric (max 50 characters)";
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(form.partDescription))
      newErrors.partDescription =
        "Part Description must be alphanumeric (max 100 characters)";

    // Required field validation
    if (!form.roReceiveDate) newErrors.roReceiveDate = "Ro Received Date is required";

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
try {
      let updateOrdertData={
              ...form,
              userAction:'1',
              makerUserName: sessionStorage.getItem('username'),
              makerDate: new Date().toISOString().split('T')[0],
              userRole: sessionStorage.getItem('roleId'),
          }
          console.log("Id :",form.srNo);
            let response = await updateOrder(reportId, updateOrdertData);
            if (response) {
              navigate("/editCustomerOrder");
              toast.success("Orders updated successfully");
            }
    } catch (error) {
      console.error("Error updating order:", error);
      toast.error("Failed to update order.");
    }
  };


  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Edit Customer Order"  isBack={true}/>
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
                    value={form.srNo}
                    onChange={handleChange}
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
                    value={form.batchNo}
                    onChange={handleChange}
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
            value={form.roNo}
            onChange={handleChange}
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
            value={form.roReceiveDate}
            onChange={handleChange}
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
                value={form.customerName}
                onChange={handleChange}
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
                value={form.partNo}
                onChange={handleChange}
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
                value={form.partDescription}
                onChange={handleChange}
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
                    value={form.quantity}
                    onChange={handleChange}                 
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
                        value={form.status}
                        onChange={handleChange}
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
                    <button type="submit" className="btn btn-primary">Submit</button>
                    </div>
                  </div>
                </form>
                </div>
              </div>
           </div>
      </div>
      </div>
      <Footer />
    </div >
    </div>
  );
};

export default CustomerOrder;
