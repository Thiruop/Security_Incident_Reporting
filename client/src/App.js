import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Registration from './pages/Registration';
import Dashboard from './pages/Dashboard';
import SideBar from './components/SideBar';
import Header from './components/Header';
import { ViewReports } from './pages/ViewReports';
import { UpdateReports } from './pages/Admins/UpdateReports';
import { ViewLogs } from './pages/Admins/ViewLogs';
import { AddReports } from './pages/Users/AddReports';
import ProtectedRoute from './components/ProtectedRoute';

function ProtectedLayout({ children, isSidebarOpen, toggleSidebar }) {
  return (
    <div className="flex h-screen">
      {isSidebarOpen && (
        <div className="z-40">
          <SideBar />
        </div>
      )}

      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <Header toggleSidebar={toggleSidebar} />
        <div className="p-4 overflow-auto">{children}</div>
      </div>
    </div>
  );
}

export default function App() {
  const LoggedIn = localStorage.getItem('LoggedIn');
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  return (
    <HashRouter>
      <Routes>
        <Route
          path="/"
          element={LoggedIn ? <Navigate to="/dashboard" replace /> : <Login />}
        />
        <Route path="/registration" element={<Registration />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <ProtectedLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-reports"
          element={
            <ProtectedRoute>
              <ProtectedLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                <ViewReports />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/update-reports"
          element={
            <ProtectedRoute>
              <ProtectedLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                <UpdateReports />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/view-logs"
          element={
            <ProtectedRoute>
              <ProtectedLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                <ViewLogs />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/add-reports"
          element={
            <ProtectedRoute>
              <ProtectedLayout isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar}>
                <AddReports />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}
