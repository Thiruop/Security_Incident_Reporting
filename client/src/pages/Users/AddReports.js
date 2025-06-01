import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 

export const AddReports = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState({
    title: '',
    description: '',
    category: ''
  });

  const FormSubmission = (e) => {
    e.preventDefault();
    fetch("http://localhost:4000/api/reports", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(reportData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Report submitted successfully:", data);
        setReportData({ title: '', description: '', category: '' });
     
         toast.success('Report submitted successfully', {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
        
                setTimeout(() => {
                  navigate("/view-reports");
                }, 3000);
         })
      .catch((error) => {
         toast.error('Report submission failed', {
                  position: "top-right",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                });
        console.error("Error submitting report:", error);
      });
  };

  return (
    <div className="flex justify-center items-center mt-10">
      <form
        className="w-full max-w-2xl p-6 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md"
        onSubmit={FormSubmission}
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-white">Add Report</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Title */}
          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Title</label>
            <input
              type="text"
              value={reportData.title}
              onChange={(e) => setReportData({ ...reportData, title: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              maxLength={100}
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
            <select
              value={reportData.category}
              onChange={(e) => setReportData({ ...reportData, category: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            >
              <option value="">Select Category</option>
              <option value="bug">Bug</option>
              <option value="feature">Feature Request</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
            <textarea
              value={reportData.description}
              onChange={(e) => setReportData({ ...reportData, description: e.target.value })}
              className="w-full border-2 border-gray-300 rounded-md px-3 py-2 h-24 resize-none focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>

          <div className="md:col-span-2 text-center mt-4">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Submit Report
            </button>
          </div>
        </div>
      </form>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};
