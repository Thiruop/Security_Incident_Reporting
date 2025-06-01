import React, { useState } from 'react';
import { useQuery, useQueries } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import NotFound from '../assets/NotFound.jpg';
import { Pencil, Filter } from 'lucide-react';


const getReports = async () => {
  const response = await fetch('http://localhost:4000/api/reports', {
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


const fetchNotes = async (reportId) => {
  const response = await fetch(`http://localhost:4000/api/reports/${reportId}/note`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
    },
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch notes');
  }
  return data.map((noteObj) => noteObj.note);
};

const getStatusButtonStyle = (status) => {
  switch (status.toLowerCase()) {
    case 'open': return 'bg-red-500';
    case 'under review': return 'bg-orange-500';
    case 'resolved': return 'bg-green-500';
    default: return 'bg-gray-400';
  }
};

const formatDate = (dateString) => new Date(dateString).toISOString().split('T')[0];

export const ViewReports = () => {
  const navigate = useNavigate();
  const role = localStorage.getItem('role')?.toLowerCase();

  const [showFilter, setShowFilter] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const {
    data: reports,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['reports'],
    queryFn: getReports,
  });

  const notesResults = useQueries({
    queries: (reports || []).map((report) => ({
      queryKey: ['notes', report.id],
      queryFn: () => fetchNotes(report.id),
      enabled: !!reports,
    })),
  });

  if (isLoading) {
    return <div className="text-center mt-10 text-lg">Loading...</div>;
  }

  if (error?.message === 'No reports found') {
    return role === 'admin' ? (
      <div className="text-center mt-10 text-xl text-gray-700 dark:text-white">
        No reports created yet
      </div>
    ) : (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-150px)] space-y-4">
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

  const EditData = (report) => () => {
    navigate('/update-reports', { state: { report } });
  };

  const filteredReports = reports.filter((r) =>
    (!selectedStatus || r.status.toLowerCase() === selectedStatus.toLowerCase()) &&
    (!selectedCategory || r.category === selectedCategory)
  );

  return (
    <div className="mt-6">
      
      <div className="flex justify-end items-center space-x-4 mb-4">
        <button
          onClick={() => setShowFilter((prev) => !prev)}
          className="text-sm flex items-center bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          <Filter className="w-4 h-4 mr-1" />
          Filter
        </button>

        {showFilter && (
          <div className="flex space-x-4 items-center">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-2 py-1 rounded border dark:bg-gray-800 dark:text-white bg-gray-200"
            >
              <option value="">All Status</option>
              <option value="open">Open</option>
              <option value="under review">Under Review</option>
              <option value="resolved">Resolved</option>
            </select>

            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-2 py-1 rounded border dark:bg-gray-800 dark:text-white bg-gray-200 "
            >
              <option value="">All Categories</option>
              {[...new Set(reports.map((r) => r.category))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReports.map((report, index) => {
          const noteQuery = notesResults[index];
          const latestNote = noteQuery?.data?.[0];

          return (
            <div
              key={report.id}
              className="bg-gray-50 dark:bg-gray-800 p-5 rounded-xl shadow-md flex flex-col justify-between h-full"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">
                    {report.title}
                  </h3>
                  {role === 'admin' && (
                    <button title="Edit Report">
                      <Pencil
                        className="w-5 h-5 text-indigo-500 hover:text-indigo-700"
                        onClick={EditData(report)}
                      />
                    </button>
                  )}
                </div>

                <p className="mt-2 text-gray-700 dark:text-gray-300 break-words whitespace-pre-line">
                  {report.description}
                </p>

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

                {role === 'admin' && (
                  <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                    <strong>User ID:</strong> {report.user_id}
                  </div>
                )}

                {latestNote && (
                  <p className="mt-3 text-sm text-blue-600 dark:text-blue-300">
                    <strong>Note:</strong> {latestNote}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
