import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import NotFound from '../assets/NotFound.jpg';

const getReports = async () => {
  const response = await fetch('http://localhost:4000/api/reports', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Network response was not ok');
  }

  return data;
};


const getStatusButtonStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'open':
      return 'bg-red-500';
    case 'under review':
      return 'bg-orange-500';
    case 'resolved':
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
};

// Helper: format date
const formatDate = (dateString) => {
  return new Date(dateString).toISOString().split('T')[0];
};

export const ViewReports = () => {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (error?.message === 'No reports found') {
    return (
      <div className="flex flex-col items-center justify-center mt-16 space-y-4">
        <p className="text-xl font-semibold text-gray-700 dark:text-white">No reports created</p>
        <button
          onClick={() => navigate('/add-reports')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Add Report
        </button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center mt-10">
        <img
          src={NotFound}
          alt="Error occurred"
          className="w-72 h-auto object-cover rounded shadow-md"
        />
        <p className="text-red-500 mt-4">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {data.map((report, index) => (
        
        <div key={index} className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md flex justify-between flex-col h-full">
            <div>
          <div className="flex justify-between items-start">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{report.title}</h3>
    
          </div>

          <p className="mt-2 text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">
            {report.description}
          </p>
          </div>
            <div>
          <div className="flex items-center justify-between mt-3 text-sm">
            <p className="italic text-black dark:text-white">{report.category}</p>
            <button
              className={`px-3 py-1 text-sm font-medium rounded-full text-white ${getStatusButtonStyle(report.status)}`}
              disabled
            >
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </button>
          </div>

          <div className="flex items-center justify-between mt-2 text-sm text-gray-600 dark:text-gray-400">
            <p><strong>Created:</strong> {formatDate(report.created_at)}</p>
            <p><strong>Updated:</strong> {report.updated_at ? formatDate(report.updated_at) : 'Not Yet'}</p>
          </div>
          </div>
        </div>
      ))}
    </div>
  );
};
