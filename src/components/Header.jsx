// Header.jsx
import React, { useState } from "react";
import {
  Bell,
  MessageSquare,
  Settings,
  HelpCircle,
  User,
  ChevronDown,
  LogOut,
} from "lucide-react";
import styles from "./Header.module.css";
import ProfileLogo from "../static/img/prfileLogo.png";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const username = sessionStorage.getItem('username');
  const role =sessionStorage.getItem('role');
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const handlelogout = () => {
    sessionStorage.clear(); //clear token and other session data
    navigate("/");
    toast.success("Log out Successful");
  };
  return (
    <div className={styles.headerContainer}>
      <div className={styles.headerContent}>
        {/* Logo & App Name */}

        {/* Right Side Actions */}
        <div className={styles.rightSection}>
          {/* Notification Icon */}
          <button className={styles.iconButton}>
            <Bell size={20} />
            <span className={styles.badge}>4</span>
          </button>

          {/* Messages Icon */}
          <button className={styles.iconButton}>
            <MessageSquare size={20} />
            <span className={styles.badge}>2</span>
          </button>

          {/* Help Icon */}
          <button className={styles.iconButton}>
            <HelpCircle size={20} />
          </button>

          {/* Divider */}
          <div className={styles.divider}></div>

          {/* User Profile */}
          <div className={styles.profileContainer}>
            <button className={styles.profileButton} onClick={toggleDropdown}>
              <div className={styles.avatarContainer}>
                <img src={ProfileLogo} alt="" className={styles.avatar} />
              </div>
              <div className={styles.userInfo}>
                <div className={styles.userName}>{username}</div>
                <div className={styles.userRole}>{role}</div>
              </div>
              <ChevronDown size={16} className={styles.dropdownIcon} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <div className={styles.dropdownHeader}>
                  <p className={styles.dropdownName}>{username}</p>
                  <p className={styles.dropdownEmail}>Admin@example.com</p>
                </div>
                <a href="#" className={styles.dropdownItem}>
                  <User size={16} className={styles.dropdownItemIcon} />
                  Your Profile
                </a>
                <div className={styles.dropdownDivider}></div>
                <a
                  // href="/"
                  className={styles.dropdownItemDanger}
                  onClick={handlelogout}
                >
                  Log out
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
