import React, { useState, useEffect } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import axiosInstance from "../axiosConfig";
import { createUser } from "../services/db_manager";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const AddUser = () => {
  const [form, setForm] = useState({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    role: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    location: sessionStorage.getItem('location'),
  });
  const [roles, setRoles] = useState([]); // NEW STATE

  useEffect(() => {
    const token = sessionStorage.getItem("jwt_token");
    axiosInstance.get("/api/roles/role")
      .then((response) => {
        console.log("Fetched roles:", response.data);
        setRoles(response.data);
      })
      .catch((error) => {
        console.error("Failed to fetch roles", error);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  // Helper function to validate each field
  const validateField = (fieldName, value, rules) => {
    if (!value) return `${fieldName} is required.`;

    if (rules.type === 'number' && isNaN(value)) {
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
// New validation rules object
const validationRules = {
  firstName: {
    length: 50,
    regex: /^[a-zA-Z]*$/,
  },
  middleName: {
    length: 50,
    regex: /^[a-zA-Z]*$/,
  },
  lastName: {
    length: 50,
    regex: /^[a-zA-Z]*$/,
  },
  username: {
    length: 50,
    regex: /^[a-zA-Z0-9\s]*$/,
  },
  mobileNumber: {
    regex: /^[0-9\s]*$/,
   // type: 'number',
    length: 12,
  },
  address: {
    length: 100,
    regex: /^[a-zA-Z0-9\s]*$/,
  },
  city: {
    length: 50,
    regex: /^[a-zA-Z0-9\s]*$/,
  },
  state: {
    length: 50,
    regex: /^[a-zA-Z\s]*$/,
  },
  country: {
    length: 50,
    regex: /^[a-zA-Z\s]*$/,
  },
  email: {
    length: 255,
    regex: /^\S+@\S+\.\S+$/,
  },
};
  const validateDataType = (event, dataType) => 
    {
        document.getElementById('')
        let value = event.target.value
        if (dataType === 'A') 
        {
            value = value.replace(/[^a-zA-Z0-9 ]/g, '');
            event.target.classList.add('is-valid')
        } 
        else if (dataType === 'N') 
        {
            value = value.replace(/[^0-9]/g, '');
            event.target.classList.add('is-valid')
        } 
        else if (dataType === 'ANS') 
        {
            value = value.replace(/[^a-zA-Z0-9@.]/g, '');
            event.target.classList.add('is-valid')
        }
    
        event.target.value = value
    };
  function validateLen(event, minLen, maxLen) 
    {
        let value = event.target.value.substring(0,maxLen)
        event.target.value = value
        let elementLen = value.length
        if (elementLen > maxLen) 
        {
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
        } 
        else if (elementLen < minLen) 
        {
            event.target.classList.remove('is-valid')
            event.target.classList.add('is-invalid')
        } 
        else 
        {
            event.target.classList.add('is-valid')
            event.target.classList.remove('is-invalid')
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

    // If all validation passes, proceed with submitting
    try {
      const response = await createUser(form);
      console.log("User added successfully:", response.data);
      alert("User Added Successfully!");

      // Reset the form after successful submission
      setForm({
    firstName: "",
    middleName: "",
    lastName: "",
    username: "",
    role: "",
    dateOfBirth: "",
    mobileNumber: "",
    email: "",
    address: "",
    city: "",
    state: "",
    country: "",
    location: "",
      });
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Failed to user.");
    }
  };

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px" }}>
        <CustomBreadcrumb breadcrumbsLabel="Add user"  isBack={true}/>

        {/* content Begin */}
        {/* <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-4 mb-0 text-gray-800">Add User</h5>
          </div>
        </div> */}
        <div className="my-2 p-2">
          <div className="container-fluid">
            <div className="row mx-1 card border border-dark shadow-lg py-2" style={{height : '397px'}}>
              <div className="col-md-12">
                <form onSubmit={handleSubmit} style={{height : '100%'}}>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-1">First Name</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="firstName"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.firstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-1">Middle Name</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="middleName"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.middleName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-1">Last Name</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="lastName"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.lastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-1">UserName</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="username"
                        onInput={(event) => {validateDataType(event,'A')}}
                        value={form.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">User Type</label>
                      <select
                         className="form-control w-100"
                          name="role"
                          value={form.role}
                           onChange={handleChange}
                             required
                      >
                        <option value="">Select</option>
                         {roles.map((role) => (
                          <option key={role.id} value={role.roleName}>
                            {role.roleName}
                            </option>
                            ))}
                    </select>
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                    <label className="col-md-2 mt-2">Date Of Birth</label>
                    <input
                      className="form-control w-100"
                      type="date"
                      name="dateOfBirth"
                      value={form.dateOfBirth}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  </div>
                  <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Mobile Number</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="mobileNumber"
                        value={form.mobileNumber}
                        onInput={(event) => {validateDataType(event,'N')}}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Email</label>
                      <input
                        className="form-control w-100"
                        type="email"
                        name="email"
                        onInput={(event) => {validateLen(event,1,255)}}
                        value={form.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Address</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="address"
                        value={form.address}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">City</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="city"
                        value={form.city}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    </div>
                    <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">State</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="state"
                        value={form.state}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 p-2 d-flex">
                      <label className="col-md-4 mt-2">Country</label>
                      <input
                        className="form-control w-100"
                        type="text"
                        name="country"
                        value={form.country}
                        onInput={(event) => {validateDataType(event,'A')}}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    </div>
                    {/* <div className="col-md-12 p-2 d-flex">
                    <div className="col-md-6 p-2 d-flex">
                    <label className="col-md-4 mt-2">Location</label>
                    <select
                    className="form-control w-100"
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    required
                     >
                    <option value="">Select</option>
                    <option value="mumbai">Mumbai</option>
                    <option value="delhi">Delhi</option>
                    </select>
                    </div>
                    </div>
                    </div> */}
                    <div className="col-md-12 text-right mt-1">
                      <div className="text-end m-0">
                    <button type="submit" className="btn btn-primary">Add User</button>
                    </div>
                  </div>
                </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div >
      
      <Footer />
    </div >
  );
};

export default AddUser;
