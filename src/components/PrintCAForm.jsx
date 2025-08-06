  // import { useEffect, useState } from "react";
  import styles from "./Checker/CheckerSupplierRegistration/PrintSupplier.module.css";
  import CheckboxWithTick from './CheckboxWithTick';
  import logo from "../static/img/logo.png";



  export const PrintCAForm = (dataMap) => {
    return (
      <div className={styles.container}>
        <div className={styles.printContainer}>
            <div style={{border: "1px solid black",margin: "1px"}}>
          {/* Header Section */}
          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "30%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              <div style={{ fontWeight: "bold" }}>1. DGCA India</div>
            </div>
            <div
              style={{
                width: "40%",
                textAlign: "center",
                padding: "10px",
                fontWeight: "bold",
                fontSize: "20px",
                borderRight: "1px solid black",
              }}
            >
              2. AUTHORISED RELEASE CERTIFICATE<br></br> CA FORM 1
            </div>
            <div style={{ width: "30%", padding: "10px",fontWeight: "bold" }}>
              3. Form Tracking Number<br/>
              {dataMap["dataMap"]?.formTrackingNumber || "N/A"}
            </div>
          </div>


          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "30%",
                padding: "10px",
              }}
            >
              <div > 4. Approved Organization Name and Address:</div><br/>
              <div className={styles.companyLogo}>
                                        <img
                                          src={logo}
                                          alt="AMC Technology Logo"
                                          className={styles.logoImage}
                                        />
            </div></div>
            <div
              style={{
                width: "40%",
                textAlign: "left",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
                          <br/>AMC TECHNOLOGY<br />
                          105, HRIDAY INDUSTRIAL ESTATE,<br />
                          HIRA INDUSTRIAL PARK, VASAI PHATA,<br />
                          VASAI EAST, PALGHAR 401 203,<br />
                          MAHARASHTRA, INDIA
                
                      </div>

            <div style={{ width: "30%", padding: "10px" }}>
              5. Work Order/Contract/Invoice:<br/>
              {dataMap["dataMap"]?.workOrderNumber || "N/A"}
            </div>
          </div>
          
          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "10%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              6. Item
            </div>
            <div style={{width: "17%", padding: "10px", borderRight: "1px solid black",}}>
             7. Description
            </div>
            <div style={{ width: "17%", padding: "10px", borderRight: "1px solid black"}}>
               8. Part No.
            </div>
            <div style={{ width: "11%", padding: "10px", borderRight: "1px solid black" }}>
              9. Qty
            </div>
            <div style={{ width: "17%", padding: "10px", borderRight: "1px solid black" }}>
              10. Serial/Batch No.
            </div>
            <div style={{ width: "31%", padding: "10px" }}>
              11. Status/Work
            </div>
          </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "10%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
             {dataMap["dataMap"]?.item || "N/A"}
            </div>
            <div
              style={{
                width: "17%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
            {dataMap["dataMap"]?.description || "N/A"}
            </div>
            <div style={{ width: "17%", padding: "10px", borderRight: "1px solid black", }}>
               {dataMap["dataMap"]?.partNo || "N/A"}
            </div>
            <div style={{ width: "11%", padding: "10px", borderRight: "1px solid black", }}>
              {dataMap["dataMap"]?.quantity || "N/A"}
            </div>
            <div style={{ width: "17%", padding: "10px", borderRight: "1px solid black", }}>
             {dataMap["dataMap"]?.serialNo || "N/A"}
            </div>
            <div style={{ width: "31%", padding: "10px", borderRight: "1px solid black", }}>
              {dataMap["dataMap"]?.status || "N/A"}
            </div>
          </div>
  
  <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "100%",
                padding: "10px",
              }}
            >
                Remarks:<br/>
             <div style={{ paddingLeft: '60px' }}>
             {dataMap["dataMap"]?.remarks || "N/A"}
             </div>
            </div>
            </div>

          <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div
              style={{
                width: "48%",
                padding: "10px",
                borderRight: "1px solid black",
              }}
            >
              13 a. Certifies that the items identified above were manufactured in <br/>conformity to:<br /><br/>
               <div style={{ display: 'flex', alignItems: 'center' }}>
        <CheckboxWithTick value={dataMap["dataMap"]?.approveDesign13a} />
        <span>approved design data and are in condition for safe operation.</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', marginTop: '10px' }}>
        <CheckboxWithTick value={dataMap["dataMap"]?.nonApproveDesign13a} />
        <span>non-approved design data specified in block 12.</span>
      </div>
            </div>
            <div
              style={{
                width: "52%",
                padding: "10px",
              }}
            >
             14 a. CAR 145.A.50 RELEASE TO SERVICE<br />
             <div style={{ display: 'flex', alignItems: 'center' }}>
        <CheckboxWithTick value={dataMap["dataMap"]?.otherRegulation14a} />
        <span>Other regulation specified to Service in block 12.</span>
        </div><br/>
             Certifies that unless otherwise specified in block 12, the work identified in block 11 and<br/>
             described in block 12, was accomplished in accordance with CAR 145 and in respect to that 
             work the items are considered ready for release to service.
            </div>
            </div>

        <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div style={{width: "24%", padding: "10px", borderRight: "1px solid black", }}>
             13 b. Authorised Signature<br /><br/><br/><br/>
            </div>
            <div style={{width: "24%", padding: "10px", borderRight: "1px solid black",}}>
             13 c. Approval / Authorisation Number<br /><br/><br/><br/>
            </div>
            <div style={{ width: "26%", padding: "10px", borderRight: "1px solid black"}}>
              14 b. Authorised Signature<br /><br/><br/><br/>
            </div>
            <div style={{ width: "26%", padding: "10px", borderRight: "1px solid black" }}>
              14 c. Certificate / Approval Ref No.<br /><br/><br/><br/>
            </div>
            </div>

            <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div style={{width: "24%", padding: "10px", borderRight: "1px solid black", }}>
             13 e. Name<br /><br/><br/><br/>
            </div>
            <div style={{width: "24%", padding: "10px", borderRight: "1px solid black",}}>
             13 f.  Date<br /><br/><br/><br/>
            </div>
            <div style={{ width: "26%", padding: "10px", borderRight: "1px solid black"}}>
              14 e. Name<br /><br/><br/><br/>
            </div>
            <div style={{ width: "26%", padding: "10px", borderRight: "1px solid black" }}>
              14 f. Date<br /><br/><br/><br/>
            </div>
            </div>

            <div
            style={{
              display: "flex",
              border: "1px solid black",
              marginBottom: "0px",
            }}
          >
            <div style={{ padding: "10px" }}>
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
      </div>
      </div>
    );
  };
  
