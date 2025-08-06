// import { useEffect, useState } from "react";
import styles from "./Checker/CheckerSupplierRegistration/PrintSupplier.module.css";

export const PrintInspectionReport = (dataMap) => {
  return (
    <div className={styles.container}>
      <div className={styles.printContainer}>
        {/* Header Section */}
        <div
          style={{
            display: "flex",
            border: "1px solid black",
            marginBottom: "15px",
          }}
        >
          <div
            style={{
              width: "20%",
              padding: "10px",
              borderRight: "1px solid black",
            }}
          >
            <div style={{ fontWeight: "bold" }}>amc</div>
          </div>
          <div
            style={{
              width: "55%",
              textAlign: "center",
              padding: "10px",
              fontWeight: "bold",
              fontSize: "16px",
              borderRight: "1px solid black",
            }}
          >
            Receiving Inspection Report
          </div>
          <div style={{ width: "25%", padding: "10px" }}>
            <div>Form: AMC-29</div>
            <div>Rev.: 00</div>
            <div>Date: Jan 2021</div>
          </div>
        </div>

        <div
          style={{
            marginBottom: "20px",
            border: "1px solid black",
            padding: "10px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "60%" }}>
              <strong>Part Number:</strong>{" "}
              {dataMap["dataMap"]?.partNumber || "N/A"}
            </div>
            <div style={{ width: "40%" }}>
              <strong>Report No:</strong>{" "}
              {dataMap["dataMap"]?.reportNo || "N/A"}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
          <div style={{ width: "60%" }}>
              <strong>Part Description:</strong>{" "}
              {dataMap["dataMap"]?.partDesc || "N/A"}
            </div>
            <div style={{ width: "40%" }}>
              <strong>Date:</strong>{" "}
              {dataMap["dataMap"]?.date || new Date().toLocaleDateString()}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
          <div style={{ width: "60%" }}>
              <strong>Purchase Order No:</strong>{" "}
              {dataMap["dataMap"]?.purchaseOrderNo || "N/A"}
            </div>
            <div style={{ width: "40%" }}>
              <strong>Qty:</strong>{" "}
              {dataMap["dataMap"]?.qty || "N/A"}
            </div>
             
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "10px",
            }}
          >
            <div style={{ width: "60%" }}>
              <strong>Supplier:</strong>{" "}
              {dataMap["dataMap"]?.supplierName || "N/A"}
            </div>
            <div style={{ width: "40%" }}>
              <strong>Receive Qty:</strong>{" "}
              {dataMap["dataMap"]?.qtyReceive || "N/A"}
            </div>
          </div>
        

        {/* Quality Process Section */}
        <div style={{ marginBottom: "15px" }}>
          
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              border: "1px solid black",
            }}
          >
            <thead>
              <tr>
                <th
                  style={{
                    padding: "8px",
                    width: "10%",
                    textAlign: "left",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  Sr.No.
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "30%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  Check List
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "30%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                    borderRight: "1px solid black",
                  }}
                >
                  Requirements
                </th>
                <th
                  style={{
                    padding: "8px",
                    width: "30%",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >
                  Observation
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  1
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Invoice</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Quantity and Unit Price must match with Purchase Order</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.invoiceObservation || "N/A"}</td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  2
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Manufacturer Certificate</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >COC must available</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.manufacturerCertObservation || "N/A"}</td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                 3
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Supplier Certificate(Distributor/Third Party)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >COC must available, in case "No" direct supply from Mfg.</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.supplierCertObservation || "N/A"}</td>
              </tr>
              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  4
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Certificate Full Traceability</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Must Available</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.fullTraceabilityObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  5
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Batch Number</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Must match(Physical Unit lable & all COC)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.batchNumberObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  6
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Date of Manufacturing & Date of Expiry(If Applicable)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Must match(Physical Unit lable & all COC)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.dateOfManufacturingObservation || "N/A"}<br/>
                {dataMap["dataMap"]?.dateOfExpiryObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  7
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Shelf Life(If Applicable)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >80% and above</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.selfLifeObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  8
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                  >Technical Data Sheet(TDS) & MSDS</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Must Available</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.tdsObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  9
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Material Condition</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >No Damage / No Leakage</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.materialConditionObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  10
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Specification(If any)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Must Match with Purchase Order Specification</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.specificationObservation || "N/A"}</td>
              </tr>

              <tr>
                <td
                  style={{
                    padding: "8px",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >
                  11
                </td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Documents(If Import)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderRight: "1px solid black",
                    borderBottom: "1px solid black",
                  }}
                >Air Way Bill(AWB) & Bill Of Entry(If Available)</td>
                <td
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    borderBottom: "1px solid black",
                  }}
                >{dataMap["dataMap"]?.documentObservation || "N/A"}</td>
              </tr>

            </tbody>
          </table>
        </div>

        {/* Internal Use Section */}
        <div
          style={{
            marginTop: "30px",
            borderTop: "1px solid black",
            paddingTop: "10px",
          }}
        >
          <div style={{ marginBottom: "10px"}}>
          <strong>LOT Accepted(Yes/No/With Deviation) :</strong>{" "}
          {dataMap["dataMap"]?.lotAccepted || "N/A"}  
          </div>
          <div style={{ marginBottom: "10px"}}>
          <strong> Remark(If Any) :</strong>{" "}
          {dataMap["dataMap"]?.remark || "N/A"} 
          </div>
          </div>
          <hr style={{ border: "1px solid black", margin: "10px 0" }} />
          <div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  }}
>
  <div style={{ width: "33%" }}>
    {dataMap["dataMap"]?.makerUserName || "N/A"}
  </div>
  <div style={{ width: "33%" }}>
    {dataMap["dataMap"]?.makerDate || "N/A"}
  </div>
  <div style={{ width: "33%" }}>
    {/* Empty or placeholder if needed */}
  </div>
</div>

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "10px",
  }}
>
  <div style={{ width: "33%" }}>
    <strong>Checked By Inspector</strong>
  </div>
  <div style={{ width: "33%" }}>
    <strong>Date</strong>
  </div>
  <div style={{ width: "33%" }}>
    <strong>Quality Manager Approval</strong>
  </div>
</div>
          </div>
        </div>
      </div>
    // </div>
  );
};
