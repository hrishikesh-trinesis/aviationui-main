import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { getMaterialDetail, updateMaterial, fetchPartNumbersAndDescriptions } from "../services/db_manager";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const EditMaterialNote = () => {
  const location = useLocation();
  const { materialId } = location.state || "";
  const navigate = useNavigate();
  const [form, setForm] = useState({
    mrnNo: "",
    supplierName: "",
    orderNumber: "",
    challanNo: "",
    receiptDate: "",
    partNumber: "",
    partDescription: "",
    quantity: "",
    unitOfMeasurement: "",
    storeInchargeSign: "",
    qualityAcceptance: "",
  });

  useEffect(() => {
    const fetchMaterialDetail = async () => {
      try {
        const response = await getMaterialDetail(materialId);
        if (response.data) {
          setForm(response.data);
        }
      } catch (error) {
        console.error("Error fetching material details:", error);
        alert("Error fetching material details.");
      }
    };
    fetchMaterialDetail();
  }, [materialId]);

  const [partData, setPartData] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("");
    const [selectedDescription, setSelectedDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchPartNumbersAndDescriptions();
        setPartData(result);
      } catch (err) {
        console.error("Failed to fetch part list", err);
      }
    };

    fetchData();
  }, []);


  const handleProductChange = (e) => {
    const selected = e.target.value;
    setSelectedProduct(selected);

    const match = data.find((item) => item.productName === selected);
    const description = match ? match.productDescription : "";

    setSelectedDescription(description);

    setForm((prevForm) => ({
      ...prevForm,
      partNumber: selected,
      description: description,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await updateMaterial(materialId, form);
      if (response.status === 200) {
        // alert("Material updated successfully!");
        navigate("/ViewMaterialNotePage");
        toast.success("Material updated successfully!");
      }
    } catch (error) {
      console.error("Error updating material:", error);
      toast.error("Failed to update material.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Edit Material Receipt Note Form"
            isBack={true}
          />

          {/* <div className="col-md-6">
          <h5 className="mx-3 mt-4">Material Receipt Note Form</h5>
        </div> */}

          <div
            className="card border border-dark shadow mx-4 my-4 p-2"
            style={{ height: "70vh" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="col-md-12">
                <div className="row">
                  <div className="col-md-6 p-2">
                    <label>
                      MRN No{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="mrnNo"
                      value={form.mrnNo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Supplier Name{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="supplierName"
                      value={form.supplierName}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Order Number{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="number"
                      className="form-control"
                      name="orderNumber"
                      value={form.orderNumber}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Challan No{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="challanNo"
                      value={form.challanNo}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Receipt Date{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="date"
                      className="form-control"
                      name="receiptDate"
                      value={form.receiptDate}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Part Number{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <select
                      required
                      className="form-control"
                      name="partNumber"
                      value={selectedProduct}
                      onChange={handleProductChange}
                    >
                      <option value="">-- Select Part --</option>
                      {partData.map((item) => (
                        <option key={item.productName} value={item.productName}>
                          {item.productName}
                        </option>
                      ))}
                    </select>

                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Part Description{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="partDescription"
                      value={form.partDescription}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Quantity{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="number"
                      className="form-control"
                      name="quantity"
                      value={form.quantity}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Unit of Measurement{" "}
                      <span className="text-danger mx-1" style={{ fontSize: "17px" }}>*</span>
                    </label>
                    <select
                      required
                      className="form-control"
                      name="unitOfMeasurement"
                      value={form.unitOfMeasurement}
                      onChange={handleChange}
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

                  <div className="col-md-6 p-2">
                    <label>
                      Store Incharge Sign{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="storeInchargeSign"
                      value={form.storeInchargeSign}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="col-md-6 p-2">
                    <label>
                      Quality Acceptance{" "}
                      <span
                        className="text-danger mx-1"
                        style={{ fontSize: "17px" }}
                      >
                        *
                      </span>
                    </label>
                    <input
                      required
                      type="text"
                      className="form-control"
                      name="qualityAcceptance"
                      value={form.qualityAcceptance}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="col-md-12 text-right mt-3">
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default EditMaterialNote;
