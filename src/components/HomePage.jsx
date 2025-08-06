import React, { useEffect, useState } from 'react';
import Header from "../components/Header";
import Footer from "../components/Footer";
import Sidebar from "../components/Sidebar";
import axiosInstance from "../axiosConfig";

const HomePage = () => {
  //const roleId = sessionStorage.getItem('roleId') || '';
  //const menuItems = useRoleMenus(roleId); // ✅ Use the hook properly

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        {/* content Begin */}
        <div className="col-md-6">
          <div className="d-sm-flex align-items-center justify-content-between mb-2 mt-3">
            <h5 className="h5 mx-3 mb-0 text-gray-800">Home Page</h5>
          </div>
        </div>

        <div className="card shadow mx-4 my-2 p-2">
          {/* content */}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;
