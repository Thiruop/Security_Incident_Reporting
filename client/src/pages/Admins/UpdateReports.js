import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css';

export const UpdateReports = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { report } = location.state || {};

  const [formData, setFormData] = useState({
    status: report?.status || 'open',
    note: '',
  });

  const statusOptions = ['open', 'under review', 'resolved'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const statusUnchanged = report.status === formData.status;
    const noteEmpty = formData.note.trim() === '';

    if (statusUnchanged && noteEmpty) {
      toast.warn('Please update status or add a note before submitting.', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        theme: "light",
      });
      return;
    }

    if (!statusUnchanged) {
      fetch(`http://localhost:4000/api/reports/${report.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: formData.status }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to update report status');
          return response.json();
        })
        .then(() => {
          toast.success('Report status updated successfully', {
            position: "top-right",
            autoClose: 2000,
            theme: "light",
          });
        })
        .catch(() => {
          toast.error('Failed to update status', {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
          });
        });
    }

    if (!noteEmpty) {
      fetch(`http://localhost:4000/api/reports/${report.id}/note`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ note: formData.note }),
      })
        .then(response => {
          if (!response.ok) throw new Error('Failed to add note');
          return response.json();
        })
        .then(() => {
          toast.success('Note added successfully', {
            position: "top-right",
            autoClose: 2000,
            theme: "light",
          });
        })
        .catch(() => {
          toast.error('Failed to add note', {
            position: "top-right",
            autoClose: 3000,
            theme: "light",
          });
        });
    }

    
    setTimeout(() => {
      navigate("/view-reports");
    }, 2500);
  };

  if (!report) {
    return <div className="text-center text-red-500 mt-10">No report data available</div>;
  }

  return (
    <div className="max-w-xl mx-auto p-6 mt-10 bg-gray-50 dark:bg-gray-800 shadow-md rounded-lg">
      <form onSubmit={handleSubmit} className="space-y-6">
        <h2 className="text-xl font-semibold text-center text-gray-700 dark:text-white">Update Report</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium">User ID</label>
            <input
              type="text"
              value={report.user_id}
              readOnly
              className="w-full px-3 py-2 dark:bg-gray-700 rounded cursor-not-allowed border-2 border-gray-200"
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium">Title</label>
            <input
              type="text"
              value={report.title}
              readOnly
              className="w-full px-3 py-2  rounded cursor-not-allowed border-2 border-gray-200 dark:bg-gray-700"
            />
          </div>

          <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium">Category</label>
            <input
              type="text"
              value={report.category}
              readOnly
              className="w-full px-3 py-2  rounded cursor-not-allowed border-2 border-gray-200 dark:bg-gray-700"
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-white font-medium mb-1">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded  dark:text-white border-2 border-gray-200 dark:bg-gray-700"
              required
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>
         
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
           <div>
            <label className="block text-gray-600 dark:text-gray-300 font-medium">Description</label>
            <textarea
              value={report.description}
              readOnly
              className="w-full px-3 py-2  rounded cursor-not-allowed border-2 border-gray-200 dark:bg-gray-700"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-gray-700 dark:text-white font-medium mb-1">Add Note</label>
            <textarea
              name="note"
              value={formData.note}
              onChange={handleChange}
              rows={3}
              placeholder="Write your note..."
              className="w-full px-3 py-2 border rounded dark:text-white border-2 border-gray-200 dark:bg-gray-700"
            />
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-8 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Update Report
          </button>
        </div>
      </form>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={false}
        pauseOnHover
        draggable
        theme="light"
      />
    </div>
  );
};
