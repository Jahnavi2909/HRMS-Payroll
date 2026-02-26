import { useState } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";
import './style.css'

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const toggleMobileSidebar = () => {
    setMobileOpen(prev => !prev);
  };

  return (
    <div className="layout">
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        toggleSidebar={toggleMobileSidebar}
      />

      <Header
        collapsed={collapsed}
        toggleSidebar={toggleMobileSidebar}
      />

      <div className={`main-content ${collapsed ? "collapsed" : ""}`}>
        <div className="content-wrapper">
          {children}
        </div>
      </div>

      {mobileOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMobileOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout;