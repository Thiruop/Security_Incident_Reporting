import React, { useEffect, useState } from 'react';
import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50'];

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

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const data = await getReports();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const totalReports = reports.length;
  const openReports = reports.filter(r => r.status === 'open').length;
  const underReviewReports = reports.filter(r => r.status === 'under review').length;
  const resolvedReports = reports.filter(r => r.status === 'resolved').length;

  const categoryData = Array.from(
    reports.reduce((acc, curr) => {
      acc.set(curr.category, (acc.get(curr.category) || 0) + 1);
      return acc;
    }, new Map()),
    ([name, value]) => ({ name, value })
  );

  const statusData = Array.from(
    reports.reduce((acc, curr) => {
      acc.set(curr.status, (acc.get(curr.status) || 0) + 1);
      return acc;
    }, new Map()),
    ([name, count]) => ({ name, count })
  );

  if (loading) return <div className="p-4 text-gray-700 dark:text-gray-200">Loading...</div>;
  if (error) return <div className="p-4 text-red-500 dark:text-red-400">Error: {error}</div>;

  return (
    <div className="p-6 text-gray-800 dark:text-white">
      {/* Row 1: Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Reports" value={totalReports} />
        <StatCard label="Open Reports" value={openReports} />
        <StatCard label="Under Review" value={underReviewReports} />
        <StatCard label="Resolved" value={resolvedReports} />
      </div>

      {/* Row 2: Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">Report Categories</h3>
          <PieChart width={350} height={300}>
            <Pie
              data={categoryData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
            >
              {categoryData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              wrapperStyle={{ borderRadius: '0.5rem' }}
            />
          </PieChart>
        </div>

        <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-white">Report Status</h3>
          <BarChart width={400} height={300} data={statusData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" allowDecimals={false} />
            <Tooltip
              contentStyle={{ backgroundColor: '#333', color: '#fff', border: 'none' }}
              labelStyle={{ color: '#fff' }}
              wrapperStyle={{ borderRadius: '0.5rem' }}
            />
            <Legend />
            <Bar dataKey="count" fill="#82ca9d" />
          </BarChart>
        </div>
      </div>
    </div>
  );
};

// Reusable Stat Card
const StatCard = ({ label, value }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow text-center">
    <h4 className="text-gray-500 dark:text-gray-300">{label}</h4>
    <p className="text-2xl font-bold dark:text-white">{value}</p>
  </div>
);

export default Dashboard;
