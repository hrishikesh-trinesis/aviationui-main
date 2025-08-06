import React, { useState, useEffect, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axiosInstance from './axiosConfig';
import HomePage from "./components/HomePage";
import LoginPage from "./components/LoginPage";
import PasswordChange from './components/PasswordChange.jsx';
import componentsMap from './components/componentsMap.jsx';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import EditProduct from "./components/EditProduct";
import EditMaterialNote from "./components/EditMaterialNote";
import EditMaterialRequisition from "./components/MaterialRequisition/EditMaterialRequisition/EditMaterialRequisition";
import EditSupplierTable from "./components/Checker/EditSupplier/EditSupplierTable";
import EditSupplierfrom from "./components/Checker/EditSupplier/Editsupplierform";
import EditStoreAcceptance from "./components/EditStoreAcceptance";
import EditPurchaseRequisition from "./components/PurchaseRequisition/EditPurchaseRequisition/EditPurchase.jsx";
import PurchaseOrderForm from "./components/PurchaseOrder/PurchaseOrder.jsx";
import AddPurchaseRequisition from "./components/PurchaseRequisition/AddpurchaseRequisition/Addpurchase.jsx";
import ViewPurchaseOrderPage from "./components/PurchaseOrder/ViewPurchaseOrder/ViewPurchaseOrder.jsx";
import EditPurchaseOrder from "./components/PurchaseOrder/EditPurchaseOrder/EditPurchaseOrder.jsx";
import EditInspectionReportForm from "./components/EditInspectionReportForm";
import EditInspectionReportTable from "./components/EditInspectionReportTable.jsx";
import ViewSupplierRegistration from "./components/Checker/CheckerSupplierRegistration/ViewSupplierRegistration";
import EditUser from "./components/EditUser";
import EditCustomerOrderForm from "./components/EditCustomerOrderForm";
import EditCustomerOrderTable from "./components/EditCustomerOrderTable.jsx";
import EditCAForm from "./components/EditCAForm.jsx";
import { useRoleMenus } from "./context/RoleMenuContext";

const App = () => {
  const token = sessionStorage.getItem('jwt_token') || '';
   const { menuItems = [], loading } = useRoleMenus();

  if (token && loading) {
    return <div style={{ padding: '2rem' }}>Loading menus...</div>;
  }

  return (
    <Router basename="/aviationui">
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {!token ? (
            <Route path="/" element={<LoginPage />} />
          ) : (
            <>
              <Route path="/" element={<LoginPage />} />
              <Route path="/homePage" element={<HomePage />} />
        <Route path="/passwordChange" element={<PasswordChange />} />
        <Route path="/editProduct/:productId" element={<EditProduct />} />
        <Route path='/editUser' element={<EditUser />} />
        {/* <Route path="/editRole/:roleId" element={<EditRole />} /> */}
        <Route path="/editstoreAcceptance" element={<EditStoreAcceptance />} />
        <Route path="/editmaterial" element={<EditMaterialNote />} />
        <Route path="/editsupplier" element={<EditSupplierTable />} />
        <Route path="/editsupplierform" element={<EditSupplierfrom />} />
        <Route path="/editmaterialrequisition" element={<EditMaterialRequisition />}/>
        <Route path="/ViewSupplier" element={<ViewSupplierRegistration />} />
        <Route path="/editInspectionReportForm" element={<EditInspectionReportForm />} />
        <Route path="/editReport" element={<EditInspectionReportTable/>} />
        <Route path="/editpurchaserequisition" element={<EditPurchaseRequisition />}/>
        <Route path="/purchaseOrder" element={<PurchaseOrderForm />}/>
        <Route path="/purchaserequistion" element={<AddPurchaseRequisition />}/>
        <Route path="/viewpurchaseOrder" element={<ViewPurchaseOrderPage />}/>
        <Route path="/editpurchaseorder" element={<EditPurchaseOrder />}/>
        <Route path="/editCustomerOrderForm" element={<EditCustomerOrderForm />} />
        <Route path="/editCustomerOrder" element={<EditCustomerOrderTable/>} />
        <Route path="/editCAForm" element={<EditCAForm/>} />
        {/* <Route path="/ViewStoreAcc" element={<ViewSupplierRegis />} /> */}

    {menuItems.flatMap((menu) =>
                menu.subMenus.map((sub) => {
                  const Component = componentsMap[sub.component];
                  const routePath = `${sub.path.replace(/^\/+/, "")}`;
                  if (!Component) return null;
                  return <Route key={routePath} path={routePath} element={<Component />} />;
                })
              )}
            </>
          )}
          {/* Fallback */}
          <Route path="*" element={<div style={{ padding: "2rem" }}>404 - Page Not Found</div>} />
        </Routes>
      </Suspense>
      <ToastContainer />
    </Router>
  );
};

export default App;
