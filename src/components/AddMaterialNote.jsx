import React, { useState, useEffect } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { addMaterialNote, fetchPartNumbersAndDescriptions } from "../services/db_manager";
import { toast } from "react-toastify";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const MaterialReceiptNoteForm = () => {
  const [form, setForm] = useState({
    mrnNo: "",
    supplierName: "",
    orderNumber: "",
    challanNo: "",
    receiptDate: "",
    partNumber: "",
    partDescription: "",
    quantity: "",
    storeInchargeSign: "",
    unitOfMeasurement: "",
    qualityAcceptance: "",
  });

  const [errors, setErrors] = useState({});
  const [data, setData] = useState([]); // To hold part numbers and descriptions
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchPartNumbersAndDescriptions();
        console.log("Fetched part list:", result);
        setData(result);
      } catch (err) {
        console.error("Failed to fetch product list", err);
      }
    };

    fetchData();
  }, []);

  const validateForm = () => {
    let newErrors = {};

    // Numeric fields validation
    if (!/^\d{1,15}$/.test(form.mrnNo))
      newErrors.mrnNo = "MRN No must be a number (max 15 digits)";
    if (!/^\d{1,20}$/.test(form.orderNumber))
      newErrors.orderNumber = "Order Number must be a number (max 20 digits)";
    // if (!/^\d{1,20}$/.test(form.partNumber))
    //   newErrors.partNumber = "Part Number must be a number (max 20 digits)";
    if (!/^\d{1,10}$/.test(form.quantity))
      newErrors.quantity = "Quantity must be a number (max 10 digits)";

    // Alphanumeric fields validation
    if (!/^[a-zA-Z0-9 ]{1,100}$/.test(form.supplierName))
      newErrors.supplierName =
        "Supplier Name must contain only alphabet and number (max 100 characters)";
    if (!/^[a-zA-Z0-9 ]{1,50}$/.test(form.challanNo))
      newErrors.challanNo =
        "Challan No must be alphanumeric (max 50 characters)";
    if (!/^[a-zA-Z0-9 ]{1,200}$/.test(form.partDescription))
      newErrors.partDescription =
        "Part Description must be alphanumeric (max 200 characters)";

    // Required field validation
    if (!form.receiptDate) newErrors.receiptDate = "Receipt Date is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProductChange = (e) => {
    const selected = e.target.value;

    // Find the corresponding part description
    const selectedItem = data.find((item) => item.productName === selected);
    const description = selectedItem ? selectedItem.productDescription : "";

    setForm((prevForm) => ({
      ...prevForm,
      partNumber: selected,
      partDescription: description,
    }));
  };

  const handleChange = (e) => {
  const { name, value } = e.target;
  setForm((prevForm) => ({
    ...prevForm,
    [name]: value,
  }));
};


  const handleSave = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await addMaterialNote(form);
      // alert('Material Receipt Note saved successfully!');
      toast.success("Material Receipt Note saved successfully!");
      resetForm();
    } catch (error) {
      console.error("Error saving material:", error);
      toast.error("Failed to save material receipt note.");
    }
  };

  const resetForm = () => {
    setForm({
      mrnNo: "",
      supplierName: "",
      orderNumber: "",
      challanNo: "",
      receiptDate: "",
      partNumber: "",
      partDescription: "",
      quantity: "",
      storeInchargeSign: "",
      qualityAcceptance: "",
      unitOfMeasurement: "",
    });
    setErrors({});
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
          <CustomBreadcrumb
            breadcrumbsLabel="Add Material Receipt Note Form"
            isBack={true}
          />

          {/* <div className="col-md-6">
          <h5 className="mx-3 mt-4">Material Receipt Note Form</h5>
        </div> */}

          <div
            className="card border border-dark shadow mx-4 my-4 p-2"
            style={{ height: "70vh" }}
          >
            <form onSubmit={handleSave}>
              <div className="col-md-12">
                <div className="row">
                  {[
                    { label: "MRN No", name: "mrnNo", type: "text" },
                    { label: "Supplier Name", name: "supplierName", type: "text" },
                    { label: "Order Number", name: "orderNumber", type: "number" },
                    { label: "Challan No", name: "challanNo", type: "text" },
                    { label: "Receipt Date", name: "receiptDate", type: "date" },
                    { label: "Part Number", name: "partNumber", type: "select" },
                    { label: "Part Description", name: "partDescription", type: "autofill" },
                    { label: "Quantity", name: "quantity", type: "number" },
                    {
                      label: "Unit of Measurement",
                      name: "unitOfMeasurement",
                      type: "Option",
                      options: ["EA", "RL", "QT", "GAL", "KIT", "LTR", "SHT", "Sq.ft", "Sq.mtr"]
                    },
                    { label: "Store Incharge Sign", name: "storeInchargeSign", type: "text" },
                    { label: "Quality Acceptance", name: "qualityAcceptance", type: "text" },
                  ].map(({ label, name, type, options }) => (
                    <div className="col-md-6 p-2" key={name}>
                      <label>
                        {label}
                        <span className="text-danger mx-1" style={{ fontSize: "17px" }}>*</span>
                      </label>

                      {type === "Option" ? (
                        // Existing unitOfMeasurement dropdown
                        <select
                          className="form-control"
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          required
                        >
                          <option value="">-- Select Unit --</option>
                          {options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : type === "select" ? (
                        // NEW: Part Number dropdown
                        <select
                          className="form-control"
                          name={name}
                          value={form[name]}
                          onChange={(e) => {
                            const selected = e.target.value;
                            const selectedItem = data.find((item) => item.productName === selected);
                            const description = selectedItem?.productDescription || "";

                            setForm((prevForm) => ({
                              ...prevForm,
                              partNumber: selected,
                              partDescription: description, // Auto-fill here
                            }));
                          }}
                          required
                        >
                          <option value="">-- Select Part --</option>
                          {data.map((item, i) => (
                            <option key={i} value={item.productName}>
                              {item.productName}
                            </option>
                          ))}
                        </select>
                      ) : type === "autofill" ? (
                        // NEW: Auto-filled, disabled input
                        <input
                          type="text"
                          className="form-control"
                          name={name}
                          value={form[name]}
                          disabled
                        />
                      ) : (
                        // Fallback: all other inputs
                        <input
                          type={type}
                          className="form-control"
                          name={name}
                          value={form[name]}
                          onChange={handleChange}
                          required
                        />
                      )}


                      {errors[name] && (
                        <span className="text-danger">{errors[name]}</span>
                      )}
                    </div>
                  ))}

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

export default MaterialReceiptNoteForm;
