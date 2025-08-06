import React, { useEffect, useState } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";
import { updateCAForm } from "../services/db_manager";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import styles from "./CAForm.module.css";
import { Search, Save } from "lucide-react";
import logo from "../static/img/logo.png";



const EditCAForm= () => {
    const [partLoading, setPartLoading] = useState(false);
   const [partError, setPartError] = useState(null);          
    const [error, setError] = useState('');              // Error message
    const [formError, setFormError] = useState(''); // general error message
    const [document, setDocument] = useState(null);
    const [success, setSuccess] = useState(''); 
   const location = useLocation();
  const { reportId ,reportData } = location.state || "";
  const navigate = useNavigate();
const [formData, setFormData] = useState({
  formTrackingNumber: "",
  workOrderNo: "",
  item: "1",
  description: "",
  partNo: "",
  quantity: "",
  serialNo: "",
  status: "",
  remarks: "",
  approveDesign13a: "N",
  nonApproveDesign13a: "N",
  otherRegulation14a: "N",
  authorisedSign13b: "",
  authorisationNumber13c: "",
  authorisedSign14b: "",
  approvalRefNo14c: "",
  name13d: "",
  date13e: "",
  name14d: "",
  date14e: "",
});

useEffect(() => {
      
      if (reportData && reportId) {
        setFormData((prevData) => ({
          ...prevData,
          ...reportData, 
        }));
      }
    }, [reportData, reportId]);

    const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...form, [name]: value });
  };
const handleCheckboxChangeYN = (field) => {
  setFormData((prev) => ({
    ...prev,
    [field]: prev[field] === "Y" ? "N" : "Y",
  }));
};
  // Handle input changes for each field
  const handleInputChange = (e, setter) => {
    setter(e.target.value);
  };


  // Handle form submission to create a new role
  const handleSave = async (e) => {
    e.preventDefault();
   // if (!validateForm()) return;

    const token = sessionStorage.getItem("jwt_token");
  if (!token) {
  setFormError('You need to be logged in again');
    return;
  }
try {
      let updateOrdertData={
              ...formData,
          }
          console.log("Id :",formData.id);
            let response = await updateCAForm(reportId, updateOrdertData);
            if (response) {
              navigate("/viewCAForm");
              toast.success("CA Form updated successfully");
            }
    } catch (error) {
      console.error("Error updating CA Form:", error);
      toast.error("Failed to update CA Form.");
    }
  };


  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Edit CA Form"  isBack={true}/>
        <div className={styles.container}>
              <div className={styles.formContainer}>
                <div className={`${styles.companySection} flex items-center justify-between gap-4`}>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                  1. DGCA India
                </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
            <h1 className="text-center font-bold text-lg">
             2. AUTHORISED RELEASE CERTIFICATE <br></br> CA FORM 1
            </h1>
          </div>
          
                <div className={`${styles.companyInfo} flex items-center`}>
                   <label htmlFor="formTrackingNumber" className="mr-2">
                      3. Form Tracking Number:
                  </label>
                  <input
                    id="formTrackingNumber"
                    type="text"
                    className={styles.inputField}
                    value={formData.formTrackingNumber}
                    onChange={(e) => handleInputChange("poNo", e.target.value)}
                  />
            </div>
        </div>

          <div className={`${styles.companySection} flex items-center `}>
             <div className={styles.companyInfo}>
              4. Approved Organization Name and Address:
            <div className={styles.companyLogo}>
                          <img
                            src={logo}
                            alt="AMC Technology Logo"
                            className={styles.logoImage}
                          />
            </div>
            </div>
            <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
              <br /><br />AMC TECHNOLOGY<br />
              105, HRIDAY INDUSTRIAL ESTATE,<br />
              HIRA INDUSTRIAL PARK, VASAI PHATA,<br />
              VASAI EAST, PALGHAR 401 203,<br />
              MAHARASHTRA, INDIA
    
          </div>
          <div className={styles.companyInfo}>
           
                <label htmlFor="workOrderNumber" className="mr-2">
                      5. Work Order/Contract/Invoice:
                  </label>
                  <input
                    id="workOrderNumber"
                    type="text"
                    className={styles.inputField}
                    value={formData.workOrderNumber}
                    onChange={(e) => handleInputChange("poNo", e.target.value)}
                  />
           </div>
          </div>      
              <div className={`${styles.companySection} flex items-center `}>
            <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
            <label htmlFor="item" className="mr-2">
                     6. Item
                  </label>
                  <input
                    id="item"
                    type="text"
                    className={styles.inputField}
                    value={formData.item}
                    onChange={(e) => handleInputChange("item", e.target.value)}
                  />
            
            </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
            <label htmlFor="description" className="mr-2">
                     7. Description
                  </label>
                  <input
                    id="description"
                    type="text"
                    className={styles.inputField}
                    value={formData.description}
                    onChange={(e) => handleInputChange("description", e.target.value)}
                  />
            
            </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
            <label htmlFor="partNo" className="mr-2">
                     8. Part No.
                  </label>
                  <input
                    id="partNo"
                    type="text"
                    className={styles.inputField}
                    value={formData.partNo}
                    onChange={(e) => handleInputChange("partNo", e.target.value)}
                  />
            
            </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
            <label htmlFor="quantity" className="mr-2">
                     9. Qty
                  </label>
                  <input
                    id="quantity"
                    type="text"
                    className={styles.inputField}
                    value={formData.quantity}
                    onChange={(e) => handleInputChange("quantity", e.target.value)}
                  />
            
            </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
            <label htmlFor="serialNo" className="mr-2">
                     10. Serial/Batch No.
                  </label>
                  <input
                    id="serialNo"
                    type="text"
                    className={styles.inputField}
                    value={formData.serialNo}
                    onChange={(e) => handleInputChange("serialNo", e.target.value)}
                  />
            
            </div>
            <div className={styles.companyInfo}>
            <label htmlFor="status" className="mr-2">
                     11. Status/Work
                  </label>
                  <input
                    id="status"
                    type="text"
                    className={styles.inputField}
                    value={formData.status}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  />
            
            </div>
            </div>

            <div className={`${styles.companySection} flex items-center `}>
             <div className="col-md-6 p-2 d-flex">
            <label htmlFor="remarks" className="col-md-4 mt-2">
                     12. Remarks
                  </label>
                  <textarea
                      className={styles.inputField}
                      name="remarks"
                      value={formData.remarks}
                      onChange={(e) => handleInputChange("remarks", e.target.value)}
                      style={{height : '70px'}}
                      required
                    ></textarea>
                    
            </div>
            </div>

                {/* Items Table */}
                <div className={`${styles.companySection} flex items-center `}>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                   13 a.  Certifies that the items identified above were manufactured in conformity to:<br /><br/>
                <label>
                <input
                 type="checkbox"
                 checked={formData.approveDesign13a === "Y"}
                 onChange={() => handleCheckboxChangeYN("approveDesign13a")}
                 />
                Approved design data and are in condition for safe operation.
                </label>

                <br />
                <label>
                <input
                  type="checkbox"
                  checked={formData.nonApproveDesign13a === "Y"}
                  onChange={() => handleCheckboxChangeYN("nonApproveDesign13a")}
                />
                Non-approved design data specified in block 12.
                </label>

                </div>  
                  <div className={styles.companyInfo}>
                    14 a. CAR 145.A.50 RELEASE TO SERVICE<br />
                    <label>
                <input
                  type="checkbox"
                  checked={formData.otherRegulation14a === "Y"}
                  onChange={() => handleCheckboxChangeYN("otherRegulation14a")}
                />
                     Other regulation specified to Service in block 12.
                     </label><br /><br/>
                      <p className="mt-1">
                        Certifies that unless otherwise specified in block 12, the work identified in block 11 and described in block 12, was accomplished in accordance with CAR 145 and in respect to that work the items are considered ready for release to service.
                      </p>
                  </div>
                </div> <div className={`${styles.companySection} flex items-center `}>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                      13 b. Authorised Signature<br />
                        <input
                    id="authorisedSign13b"
                    type="text"
                    className={styles.inputField}
                    value={formData.authorisedSign13b}
                    onChange={(e) => handleInputChange("authorisedSign13b", e.target.value)}
                  />
                  </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                        13 c. Approval / Authorisation Number<br />
                        <input
                    id="authorisationNumber13c"
                    type="text"
                    className={styles.inputField}
                    value={formData.authorisationNumber13c}
                    onChange={(e) => handleInputChange("authorisationNumber13c", e.target.value)}
                  />
                        </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                        14 b. Authorised Signature<br />
                        <input
                    id="authorisedSign14b"
                    type="text"
                    className={styles.inputField}
                    value={formData.authorisedSign14b}
                    onChange={(e) => handleInputChange("authorisedSign14b", e.target.value)}
                  />
                  </div>
                  <div className={styles.companyInfo}>
                       14 c. Certificate / Approval Ref No.<br />
                        <input
                    id="approvalRefNo14c"
                    type="text"
                    className={styles.inputField}
                    value={formData.approvalRefNo14c}
                    onChange={(e) => handleInputChange("approvalRefNo14c", e.target.value)}
                  />
                  </div></div> <div className={`${styles.companySection} flex items-center `}>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                        13 d. Name<br/>
                        <input
                    id="name13d"
                    type="text"
                    className={styles.inputField}
                    value={formData.name13d}
                    onChange={(e) => handleInputChange("name13d", e.target.value)}
                  />
                        </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                        13 e.Date(dd/mm/yyyy) <br/>
                        <input
                    id="date13e"
                    type="text"
                    className={styles.inputField}
                    value={formData.date13e}
                    onChange={(e) => handleInputChange("date13e", e.target.value)}
                  />
                        </div>
                <div className={styles.companyInfo} style={{ borderRight: "1px solid black",}}>
                        14 d. Name<br/>
                        <input
                    id="name14d"
                    type="text"
                    className={styles.inputField}
                    value={formData.name14d}
                    onChange={(e) => handleInputChange("name14d", e.target.value)}
                  />
                  </div>
                  <div className={styles.companyInfo}>
                        14 e. Date(dd/mm/yyyy)<br/> 
                        <input
                    id="date14e"
                    type="text"
                    className={styles.inputField}
                    value={formData.date14e}
                    onChange={(e) => handleInputChange("date14e", e.target.value)}
                  />
                  </div>               
                </div>
                {/* Footer Section */}
                <div className={styles.footerSection}>
                  <div className={styles.footerLeft}>
                    <div className={styles.legalText}>
                      <div>
                        USER/INSTALLER RESPONSIBILITY:
                      </div>
                      <p>
                        THiS CERTIFICATE DOES NOT AUTOMATICALLY CONSTITUTE AUTHORITY TO INSTAL THE ITEMS. WHERE THE USER/INSTALLER PERFORMS WoRK IN ACCORDANCE WITH REGULATIONS OF AN AIRWORTHINESS
                        AUTHORITY DIFFERENT THAN TH AIRWORTHINESS AUTHORITY SPECIFIED IN BLOCK 1, IT IS ESSENTIAL THAT THE USER/INSTALLER ENSURES THAT HIS/HER AIRWORTHINESS AUTHORITY ACCEPTS ITEMS FROM THE
                        AIRWORTHIINESS AUTHORITY SPECIFIED IN BLOCK 1. STATEMENTS IN BLOCKS 13A AND 14A DO NOT CONSTITUTE INSTALLATIOoN CERTIFICATON. IN ALL CASES AIRCRAFT MAINTENANCE RECORDS MUST CONTAIN
                        AN INSTALLATION CERTIFICATION ISSUED IN ACCORDANCE WITH THE NATIONAL REGULATIONS BY THE USER/INSTALLER BEFORE THE AIRCRAFT MAY BE FLOWN.
                      </p>
                    </div>
                </div>
              </div>  
                    {/* Save Button */}
                                    <div>
                                      <button onClick={handleSave} className={styles.saveButton}>
                                        <Save size={15} className={styles.saveIcon} />
                                        Save CA Form
                                      </button></div>
                    </div>                
                    </div>
                    </div>
                    </div>
                        
      <Footer />
    </div>
  );
}


export default EditCAForm;
