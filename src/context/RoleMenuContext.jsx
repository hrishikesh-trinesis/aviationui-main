import React, { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../axiosConfig";

const RoleMenuContext = createContext();

export const RoleMenuProvider = ({ children }) => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMenus = async () => {
    try {
      const roleId = sessionStorage.getItem("roleId");
      if (roleId) {
        const response = await axiosInstance.get(`/api/roles/roleMenus/${roleId}`);
        setMenuItems(response.data || []);
      }
    } catch (error) {
      console.error("Failed to fetch menu items:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  return (
    <RoleMenuContext.Provider value={{ menuItems, loading, refreshMenus: fetchMenus }}>
      {children}
    </RoleMenuContext.Provider>
  );
};

export const useRoleMenus = () => useContext(RoleMenuContext);
