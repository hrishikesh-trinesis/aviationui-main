import axios from "axios";
import { REST_API_BASE_URL } from "./base_services";
import axiosInstance from "../axiosConfig";
import ViewCustomerOrder from "../components/ViewCustomerOrder";
// ######################### ROUTE #########################
let STORE_URL = REST_API_BASE_URL + "/storeAcceptance";
let SUPPLIER_URL = REST_API_BASE_URL + "/api/supplier";
let PRODUCT_URL = REST_API_BASE_URL + "/api/product";
let MATERIAL_URL = REST_API_BASE_URL + "/api/mrn";
let MATERIAL_REQUISITION = REST_API_BASE_URL + "/api/material-requisitions";
let PURCHASE_REQUISITION = REST_API_BASE_URL + "/api/purchase-requisitions";
let PARTANDDESCRIPTION =REST_API_BASE_URL + "/api/purchase-requisitions/prodNameDesc";
// let PURCHASE_ORDERBYBATCH = REST_API_BASE_URL + "/api/purchase-orders/requisitions-by-batch";
let PURCHASE_ORDER =REST_API_BASE_URL +"/api/purchase-orders"
// ######################### DB_MANAGER #########################

// Store Acceptance
export const createStore = (Store) => axiosInstance.post(STORE_URL, Store);
// export const listAllStore = () =>  axios.get(`${STORE_URL}/`);
export const deleteStore = (StoreId) => axiosInstance.delete(`${STORE_URL}/${StoreId}`);
export const updateStore = (StoreId, Store) =>
  axiosInstance.put(`${STORE_URL}/${StoreId}`, Store);
export const getStoreDetail = (StoreId) => axiosInstance.get(`${STORE_URL}/${StoreId}`);

export const listAllStore = () => {
  return axiosInstance
    .get(`${STORE_URL}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching store:", error);
      throw error;
    });
};

//Material Requisition
export const createMaterialRequisition = (Requisition) =>
  axiosInstance.post(MATERIAL_REQUISITION, Requisition);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteMaterialRequisition = (RequisitionId) =>
  axiosInstance.delete(`${MATERIAL_REQUISITION}/${RequisitionId}`);
export const updateMaterialRequisition = (RequisitionId, Requisition) =>
  axiosInstance.put(`${MATERIAL_REQUISITION}/${RequisitionId}`, Requisition);
export const getMaterialRequisitionDetail = (RequisitionId) =>
  axiosInstance.get(`${MATERIAL_REQUISITION}/${RequisitionId}`);

export const listAllMaterialRequisition = () => {
  return axiosInstance
    .get(`${MATERIAL_REQUISITION}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Material requisition:", error);
      throw error;
    });
};

//Purchase Requistion
export const createPurchaseRequisition = (Purchase) =>
  // console.log(Purchase,"Purchase")
  axiosInstance.post(`${PURCHASE_REQUISITION}/batch`, Purchase);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deletePurchaseRequisition = (PurchaseId) =>
  axiosInstance.delete(`${PURCHASE_REQUISITION}/${PurchaseId}`);
export const updatePurchaseRequisition = (PurchaseId, Purchase) =>
  axiosInstance.put(`${PURCHASE_REQUISITION}/${PurchaseId}`, Purchase);
export const getPurchaseRequisitionDetail = (PurchaseId) =>
  axiosInstance.get(`${PURCHASE_REQUISITION}/${PurchaseId}`);

export const listAllPurchaseRequisition = () => {
  return axiosInstance
    .get(`${PURCHASE_REQUISITION}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching Purchase requisition:", error);
      throw error;
    });
};
export const DownloadCSV = () =>
  axiosInstance.get(`${PURCHASE_REQUISITION}/csv`, {
    responseType: 'blob', // important!
  });

export const DownloadPDF = () =>
  axiosInstance.get(`${PURCHASE_REQUISITION}/pdf`);

export const fetchPartNumbersAndDescriptions=()=>{
  return axiosInstance
  .get(`${PARTANDDESCRIPTION}`)
  .then((response) => {
    return response.data;
  })
  .catch((error) => {
    console.error("Error fetching PARTS AND DESCRIPTIONS:", error);
    throw error;
  });
}
// Supplier Registration
export const createSupplier = (Supplier) =>
  axiosInstance.post(`${SUPPLIER_URL}/supplierReg`, Supplier);
// export const listAllSupplier = () => axios.get(`${SUPPLIER_URL}/`);
export const deleteSupplier = (SupplierId) =>
  axiosInstance.delete(`${SUPPLIER_URL}/${SupplierId}`);
export const updateSupplier = (SupplierId, Supplier) =>
  axiosInstance.put(`${SUPPLIER_URL}/${SupplierId}`, Supplier);
export const getSupplierDetail = (SupplierId) =>
  axiosInstance.get(`${SUPPLIER_URL}/${SupplierId}`);

export const listAllSupplier = () => {
  return axiosInstance
    .get(`${SUPPLIER_URL}/`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};

//checker
export const getpendingAllSupplier = () => {
  return axiosInstance
    .get(`${SUPPLIER_URL}/getPendingSupplierList?userRole=M&userAction=1`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};
//editapproveSupplier
export const getEditingSupplierList = () => {
  return axiosInstance
    .get(`${SUPPLIER_URL}/getEditingSupplierList?userRole=M&userAction=3`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching suppliers:", error);
      throw error;
    });
};
export const ApproveSupplier = (Supplier) =>
  axiosInstance.post(`${SUPPLIER_URL}/approve`, Supplier);

// ######################### PRODUCT #########################
export const createProduct = (Product) =>
  axiosInstance.post(`${PRODUCT_URL}/create`, Product);
export const listAllProduct = () => axiosInstance.get(`${PRODUCT_URL}/active`);
export const deleteProduct = (productId) => {
  console.log(`Deleting product with ID: ${productId}`); // Log for debugging
  return axiosInstance.delete(`${PRODUCT_URL}/${productId}/soft-delete`);
};
export const updateProduct = (ProductId, Product) =>
  axiosInstance.put(`${PRODUCT_URL}/${ProductId}`, Product);
export const getProductDetail = (ProductId) =>
  axiosInstance.get(`${PRODUCT_URL}/${ProductId}`);

// ######################### MATERIAL #########################
export const addMaterialNote = (Material) =>
  axiosInstance.post(`${MATERIAL_URL}`, Material);
export const listAllMaterials = () => axiosInstance.get(`${MATERIAL_URL}`);
export const deleteMaterial = (materialId) => {
  return axiosInstance.delete(`${MATERIAL_URL}/${materialId}`);
};
export const updateMaterial = (MaterialId, Material) =>
  axiosInstance.put(`${MATERIAL_URL}/${MaterialId}`, Material);
export const getMaterialDetail = (MaterialId) =>
  axiosInstance.get(`${MATERIAL_URL}/${MaterialId}`);
// ######################### LOGIN #####################

let login_API = REST_API_BASE_URL + "/login"
let USER_API = REST_API_BASE_URL + "/api/roles/addUser"
let VIEW_USER_API = REST_API_BASE_URL + "/api/roles/viewUser"
let ROLE_API = REST_API_BASE_URL + "/api/roles"
let DELETE_USER_API = REST_API_BASE_URL + "/api/roles/userDelete"
let USER_BY_ID_API = REST_API_BASE_URL + "/api/roles/userById"
let USER_UPDATE_API = REST_API_BASE_URL + "/api/roles/userUpdate"

export const login = (loginData) => axiosInstance.post(login_API, loginData);
export const  createUser = (Login) => axiosInstance.post(USER_API, Login);
export const listAllUser = () =>  axiosInstance.get(`${VIEW_USER_API}`);
export const addRole = () =>  axiosInstance.get(`${ROLE_API}/addRole`,Role);
export const deleteUser = (userId) => {
  console.log(`Deleting user with ID: ${userId}`); // Log for debugging
  return axiosInstance.delete(`${DELETE_USER_API}/${userId}`);
};
export const userById = (userId) => {
  console.log(`Getting user with ID: ${userId}`); // Log for debugging
  return axiosInstance.get(`${USER_BY_ID_API}/${userId}`);
}
export const updateUser = (userId, userData) => {
  console.log(`Updating user with ID: ${userId}`); // Log for debugging
  return axiosInstance.put(`${USER_UPDATE_API}/${userId}`, userData);
};


// ##################### Inspection Report #########################
let PARTNumber = REST_API_BASE_URL + "/api/inspectionReport/partNo"  
let getDetailsByPartNo = REST_API_BASE_URL + "/api/inspectionReport/getDetilsByPartNo" 
let SaveInspectionReport = REST_API_BASE_URL + "/api/inspectionReport/saveInspectionReport"
let GetInpectionReportPendingList = REST_API_BASE_URL + "/api/inspectionReport/getpendingInpectionReportList"
let deleteInspectorReport = REST_API_BASE_URL + "/api/inspectionReport/deleteReport"
let GetReportDetailsById = REST_API_BASE_URL + "/api/inspectionReport/getReportDetailById"
let approveReport = REST_API_BASE_URL + "/api/inspectionReport/approveReport"
let GetEditReportList =REST_API_BASE_URL + "/api/inspectionReport/getEditReportList"
let UpdateReportNew = REST_API_BASE_URL + "/api/inspectionReport/updateReport"
let ViewReportList = REST_API_BASE_URL + "/api/inspectionReport/viewReport"
 
export const fetchPartNumbers = () => axiosInstance.get(`${PARTNumber}`);
export const fetchPartDetails = (PartNo) => axiosInstance.get(`${getDetailsByPartNo}/${PartNo}`);
export const submitInspectionReport =(payload) => axiosInstance.post(SaveInspectionReport,payload, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
export const getpendingInpectionReportList = () => axiosInstance.get(`${GetInpectionReportPendingList}`);
export const deleteReport = (reportId) => axiosInstance.delete(`${deleteInspectorReport}/${reportId}`);
export const getReportDetails = (reportId) => axiosInstance.get(`${GetReportDetailsById}/${reportId}`);
export const ApproveReport = (report) => axiosInstance.post(approveReport,report);
export const getEditReportList = () => axiosInstance.get(`${GetEditReportList}`);
export const updateReport = (InpectionReportId, ReportData) => axiosInstance.put(`${UpdateReportNew}/${InpectionReportId}`, ReportData);
export const getViewReportList = () => axiosInstance.get(`${ViewReportList}`);

//Purchase order 

// export const GetAllDataUsingBatchNo = (batchNo) =>{ 
//   axiosInstance.get(`${PURCHASE_ORDER}/${batchNo}`)};
  export const GetAllDataUsingBatchNo = (batchNo) => {
    return axiosInstance
      .get(`${PURCHASE_ORDER}/requisitions-by-batch/${batchNo}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching list:", error);
        throw error;
      });
  };

export const createPurchaseOrder = (Purchaseorder) =>{
    console.log(Purchaseorder,"ppppp")
    axiosInstance.post(`${PURCHASE_ORDER}/create`, Purchaseorder)};
export const listAllPurchaseOrder = () =>
      axiosInstance.get(`${PURCHASE_ORDER}`);
export const updatePurchaseOrder = (ID,order) =>
  axiosInstance.put(`${PURCHASE_ORDER}/${ID}`,order);
  export const getPurchaseOrder = (ID) => {
    return axiosInstance
      .get(`${PURCHASE_ORDER}/${ID}`)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error fetching list:", error);
        throw error;
      });
  };
  export const deletePurchaseOrder = (ID) => {
    return axiosInstance.delete(`${PURCHASE_ORDER}/${ID}`);
  };


  //Customer Order
  let AddCustOrder = REST_API_BASE_URL + "/api/customerOrder/addCustomerOrder"
  let GetpendingCustomerOrder = REST_API_BASE_URL + "/api/customerOrder/getpendingCustomerOrderList" 
  let ApproveCustomerOrder = REST_API_BASE_URL + "/api/customerOrder/approveCustomerOrder"
  let GetOrdertDetailsById = REST_API_BASE_URL + "/api/customerOrder/getCustomerOrderById"
  let DeleteCustomerOrder = REST_API_BASE_URL + "/api/customerOrder/deleteCustomerOrder"
  let ViewCustomerOrderList = REST_API_BASE_URL + "/api/customerOrder/viewCustomerOrder"
  let GetEditOrderList = REST_API_BASE_URL + "/api/customerOrder/getEditOrderList"
  let UpdateOrderNew = REST_API_BASE_URL + "/api/customerOrder/updateOrder"


  export const addCustomerOrder = (Order) => axiosInstance.post(AddCustOrder, Order);
  export const getpendingCustomerOrderList = () => axiosInstance.get(GetpendingCustomerOrder);
  export const ApproveCustOrders = (Order) => axiosInstance.post(ApproveCustomerOrder,Order);
  export const getCustomerOrder = (orderId) => axiosInstance.get(`${GetOrdertDetailsById}/${orderId}`);
  export const deleteCustomerOrder = (orderId) => axiosInstance.delete(`${DeleteCustomerOrder}/${orderId}`);
  export const  getViewCustomerOrderList = () => axiosInstance.get(`${ViewCustomerOrderList}`);
  export const getEditOrderList = () => axiosInstance.get(`${GetEditOrderList}`);
  export const updateOrder = (orderId, ReportData) => axiosInstance.put(`${UpdateOrderNew}/${orderId}`, ReportData);


// Dispatch Report
let DispatchReport = REST_API_BASE_URL + "/api/dispatch/save";

export const saveDispatchReport = (dispatchData) => {
  return axiosInstance.post(DispatchReport, dispatchData);
};
export const getAllDispatchReports = () => {
  return axiosInstance
    .get(`${DispatchReport}/all`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      console.error("Error fetching dispatch reports:", error);
      throw error;
    });
};
export const deleteDispatchReport = (reportId) => {
  return axiosInstance.delete(`${DispatchReport}/${reportId}`);
};
export const updateDispatchReport = (reportId, reportData) => {
  return axiosInstance.put(`${DispatchReport}/${reportId}`, reportData);
};

//CAForm
let WORKORDER = REST_API_BASE_URL + "/api/caForm/workOrderList"  
let WORKoRDERdETAILS = REST_API_BASE_URL + "/api/caForm/getDetilsByWorkOrderNo" 
let SaveCAForm = REST_API_BASE_URL + "/api/caForm/saveCAForm"
let GETALLCAFormLIST = REST_API_BASE_URL + "/api/caForm/viewCAForm"
let GETCAFormById = REST_API_BASE_URL + "/api/caForm/getCAFormByID"
let DeleteCAForm = REST_API_BASE_URL + "/api/caForm/deleteCAFormByID"
let UPDATECAFORM = REST_API_BASE_URL + "/api/caForm/updateCAForm"

export const fetchWorkOrder = () => axiosInstance.get(`${WORKORDER}`);
export const fetchWorkOrderDetails = (workOrder) => axiosInstance.get(`${WORKoRDERdETAILS}/${workOrder}`);
export const submitCAForm = (data) => axiosInstance.post(SaveCAForm, data);
export const getCAFormList = () => axiosInstance.get(`${GETALLCAFormLIST}`);
export const getCAForm = (id) => axiosInstance.get(`${GETCAFormById}/${id}`);
export const deleteCAForm = (id) => axiosInstance.delete(`${DeleteCAForm}/${id}`);
export const updateCAForm  = (formId,formData) =>axiosInstance.put(`${UPDATECAFORM}/${formId}`, formData);
