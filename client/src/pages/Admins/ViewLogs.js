import React, { useEffect, useState } from 'react';

export const ViewLogs = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    fetch("http://localhost:4000/api/reports/logs", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer " + localStorage.getItem('token')
      }
    })
      .then(res => res.json())
      .then(data => {
        setLogs(data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg p-4 ">
      <h2 className="text-xl font-semibold mb-4 text-center text-gray-800 dark:text-white">Report Activity Logs</h2>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 text-gray-900 dark:text-white">
          <tr>
            <th scope="col" className="px-6 py-3">User ID</th>
            <th scope="col" className="px-6 py-3">User Name</th>
            <th scope="col" className="px-6 py-3">Status</th>
            <th scope="col" className="px-6 py-3">Report Activity</th>
            <th scope="col" className="px-6 py-3">Timestamp</th>
            <th scope="col" className="px-6 py-3">Description</th>
          </tr>
        </thead>
        <tbody>
          {logs.length > 0 ? (
            logs.map((log, index) => (
              <tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 text-gray-900 dark:text-white">
                <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                  {log.user_id}
                </th>
                <td className="px-6 py-4">{log.username}</td>
                <td className="px-6 py-4">{log.status != null ? log.status : 'N/A'}</td>
                {console.log(log.report_activity)}
                <td className="px-6 py-4">{log.report_activity != null ? log.report_activity : 'N/A'}</td>
                <td className="px-6 py-4">{log.timestamp}</td>
                <td className="px-6 py-4">{log.description}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className="px-6 py-4 text-center text-gray-500 dark:text-gray-300">
                No logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
