import React, { useState, useEffect } from 'react';
import axiosInstance from "../axiosConfig";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import CustomBreadcrumb from "./Breadcrumb/CustomBreadcrumb";

const RoleMenuMapping = () => {
  const [roles, setRoles] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [roleMenuMapping, setRoleMenuMapping] = useState({});
  const [error, setError] = useState('');

  const token = sessionStorage.getItem("jwt_token");

  useEffect(() => {
    if (!token) {
      setError('You need to be logged in to access this page.');
      return;
    }

    const fetchRoles = async () => {
      try {
        const res = await axiosInstance.get('/api/roles/role');
        console.log("Role data:", res.data);
        setRoles(res.data);
      } catch (err) {
        console.error('Error fetching roles:', err);
      }
    };

    const fetchMenus = async () => {
      try {
        const res = await axiosInstance.get('/api/roles/menus');
        console.log("Menu data:", res.data);
        setMenus(res.data);
      } catch (err) {
        console.error('Error fetching menus:', err);
      }
    };

    fetchRoles();
    fetchMenus();
  }, [token]);
  const fetchRoleMenuMapping = async (roleId) => {
    try {
      const res = await axiosInstance.get(`/api/roles/roleMenus/${roleId}`);
      const mapping = {};
      const extractMenuIds = (menus) => {
        menus.forEach(menu => {
          if (menu.id !== undefined) {
            mapping[menu.id] = true;
          }
          if (menu.subMenus && menu.subMenus.length > 0) {
            extractMenuIds(menu.subMenus);
          }
        });
      };
  
      extractMenuIds(res.data);
      
  
      setRoleMenuMapping((prev) => ({
        ...prev,
        [roleId]: mapping,
      }));
    } catch (err) {
      console.error("Error fetching role-menu mapping:", err);
      alert("Failed to fetch role-menu mapping.");
    }
  };
  
  const handleRoleChange = async (e) => {
    const roleId = e.target.value;
    console.log("Selected Role ID:", roleId);
    setSelectedRole(roleId);
    if (roleId) {
      await fetchRoleMenuMapping(roleId);
    }
    //setRoleMenuMapping((prev) => ({ ...prev, [roleId]: prev[roleId] || {} }));
  };

  const handleParentCheck = (menuId, checked, subMenus = []) => {
    handleCheckboxChange(menuId, checked, subMenus);
  };
  
  const handleCheckboxChange = (menuId, checked, subMenus = [], parentId = null) => {
    setRoleMenuMapping((prev) => {
      const updated = {
        ...prev,
        [selectedRole]: {
          ...prev[selectedRole],
          [menuId]: checked,
        },
      };
  
      // Uncheck all submenus if parent is unchecked
      subMenus.forEach((sub) => {
        if (sub?.id !== undefined) {
          updated[selectedRole][sub.id] = false;
        } else {
          console.warn("⚠️ Submenu item has no id:", sub);
        }
      });
  
      // If a submenu is checked, ensure parent is checked too
      if (checked && parentId !== null && parentId !== undefined) {
        updated[selectedRole][parentId] = true;
      }
  
      return updated;
    });
  };
  


  const handleSaveMappings = async (e) => {
    e.preventDefault();
    if (!selectedRole) return alert("Please select a role.");

    const roleMenus = roleMenuMapping[selectedRole] || {};
    const mappings = Object.entries(roleMenus).map(([menuId, accessible]) => ({
      roleId: parseInt(selectedRole),
      menuId: parseInt(menuId),
      accessible,
    }));

    try {
      await axiosInstance.post('/api/roles/saveMapping', mappings);
      alert("Role-Menu mapping saved successfully!");
    } catch (error) {
      console.error("Error saving mappings:", error);
      alert("Failed to save mappings.");
    }
  };

  const renderMenus = (menuList) =>
    menuList.map((menu) => {
      const subMenus = menu.subMenus || menu.submenus || [];
      const isParentChecked = roleMenuMapping[selectedRole]?.[menu.id] === true;
      //const isParentChecked = roleMenuMapping[selectedRole]?.[menu.id] || false;
      //const isParentChecked = !!roleMenuMapping[selectedRole]?.[String(menu.id)];
      console.log("Parent",isParentChecked);
  
      return (
        <div key={menu.id} style={{ margin: '10px 0' }}>
          <label>
            <input
              type="checkbox"
              checked={!!roleMenuMapping[selectedRole]?.[menu.id]}
             onChange={(e) => handleParentCheck(menu.id, e.target.checked)}
            />
            <strong style={{ marginLeft: '8px' }}>{menu.name}</strong>
          </label>
  
         {subMenus.length > 0 && isParentChecked && (
  <div className="ms-4 mt-2 d-flex flex-column">
    {subMenus.map((sub) => (
      <div key={sub.id} className="form-check mb-2">
        <input
          className="form-check-input"
          type="checkbox"
          id={`sub-${sub.id}`}
          checked={roleMenuMapping[selectedRole]?.[sub.id] || false}
          onChange={(e) =>
            handleCheckboxChange(sub.id, e.target.checked, [], menu.id)
          }
        />
        <label className="form-check-label" htmlFor={`sub-${sub.id}`}>
          {sub.name}
        </label>
      </div>
    ))}
  </div>
)}

        </div>
      );
    });


  console.log("Menus to render:", menus);

  return (
    <div className="wrapper">
      <Sidebar />
      <div className="content">
        <Header />
        <div style={{ marginTop: "10px", marginBottom: "4rem" }}>
        <CustomBreadcrumb breadcrumbsLabel="Role Menu Mapping"  isBack={true}/>
         <div
            className="card border border-dark shadow mx-4 my-4 p-2"
            style={{ height: "70vh" }}
          >
                <form style={{ height: '100%' }}>
                <div className="row mb-3">
                <div className="col-md-6">
                 <label htmlFor="roleDropdown" className="form-label fw-bold">
                    Select Role:
                 </label>
      <select
        id="roleDropdown"
        className="form-select"
        value={selectedRole}
        onChange={handleRoleChange}
      >
        <option value="">-- Choose Role --</option>
        {roles.map(({ id, roleName }) => (
          <option key={id} value={id}>{roleName}</option>
        ))}
      </select>
    </div>
  </div>

    {/* <hr className="my-3" /> */}
       <div className="row mb-12">
          {/* <div className="col-md-6"> */}
             <label className="form-label fw-bold">Menu List</label>
            <div className="menu-section" style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {menus.length === 0 ? (
               <div className="alert alert-info">Loading menu data...</div>
                ) : (
                 renderMenus(menus)
                   )}
            </div>
          {/* </div> */}
        </div>
  <div className="mt-4">
    <button
      className="btn btn-primary"
      onClick={handleSaveMappings}
      disabled={!selectedRole}
    >
      Save Mapping
    </button>
  </div>
</form>
                </div>
              </div>
            
        
      
      
      <Footer />
    </div >
    </div>
  );
};

export default RoleMenuMapping;
