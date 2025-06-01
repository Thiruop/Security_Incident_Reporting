import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

function SideBar() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = localStorage.getItem('role')?.toLowerCase();

  const commonItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'View Reports', path: '/view-reports' },
  ];

  const employeeItems = [
    ...commonItems,
    { label: 'Add Reports', path: '/add-reports' },
  ];

  const adminItems = [
    ...commonItems,
    { label: 'View Logs', path: '/view-logs' },
  ];

  const menuItems =
    role === 'admin' ? adminItems : role === 'employee' ? employeeItems : [];

  const handleLogout = () => {
    fetch("http://localhost:4000/api/logout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('LoggedIn');
        localStorage.removeItem('email');
        window.location.href = '/'; 
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5 shadow-md flex flex-col justify-between">
      <div>
        <h2 className="text-2xl font-bold mb-6">Menu</h2>
        <ul>
          {menuItems.map((item) => (
            <li
              key={item.label}
              className={`mb-4 cursor-pointer p-2 rounded hover:bg-indigo-500 ${
                location.pathname === item.path ? 'bg-indigo-600' : ''
              }`}
              onClick={() => navigate(item.path)}
            >
              {item.label}
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-6 border-t pt-4">
        <button
          onClick={handleLogout}
          className="w-full text-left p-2 rounded hover:bg-red-600 bg-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default SideBar;
