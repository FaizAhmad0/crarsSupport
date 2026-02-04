import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";
import DashboardCustomizeIcon from "@mui/icons-material/DashboardCustomize";

import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import Snowfall from "react-snowfall";

const SupervisorLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current route
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/"); 
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (link, path) => {
    setActiveLink(link); 
    navigate(path);
  };

  // Update active link based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("supervisordash")) setActiveLink("dashboard");
    else if (path.includes("sup-tickets")) setActiveLink("tickets");
    else if (path.includes("sup-appointment")) setActiveLink("appointments");
    else if (path.includes("sup-complaints")) setActiveLink("complaints");
    else if (path.includes("/sp-query-dash")) setActiveLink("qdb");
  }, [location]); // Run this effect whenever the location changes

  return (
    <div className="flex pt-4 lg:pt-20 h-screen flex-col lg:flex-row overflow-x-hidden">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full w-48 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20 lg:translate-x-0`}
      >
        <nav className="flex flex-col p-4 space-y-4 mt-20 lg:mt-0">
          {/* Navigation Links */}
          {[
            {
              name: "Dashboard",
              icon: <DashboardIcon />,
              path: "/supervisordash",
            },
            {
              name: "Tickets",
              icon: <ConfirmationNumberIcon />,
              path: "/sup-tickets",
            },
            {
              name: "Appointments",
              icon: <EventIcon />,
              path: "/sup-appointment",
            },
            {
              name: "Complaints",
              icon: <EventIcon />,
              path: "/sup-complaints",
            },
            {
              name: "QDB",
              icon: <DashboardCustomizeIcon />,
              path: "/sp-query-dash",
            },
            {
              name: "Logout",
              icon: <LogoutIcon />,
              path: "/",
              action: handleLogoutClick,
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.action) {
                  item.action(); // Execute the logout or other action
                } else {
                  handleLinkClick(item.name.toLowerCase(), item.path); // Update active link and navigate
                }
              }}
              className={`flex items-center space-x-3 p-2 rounded font-semibold transition duration-200 w-full text-left ${
                activeLink === item.name.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 min-w-0 flex flex-col bg-gray-100 overflow-hidden">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto overflow-x-hidden mt-16 lg:mt-0">
          <Snowfall snowflakeCount={500} />
          {children}
        </main>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default SupervisorLayout;
