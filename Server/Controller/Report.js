import express from 'express';
import pool from '../Models/db.js';
import { sendEmailToAdmins } from '../utils/emailService.js';
export const PostReport = async (req, res) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Only employees can create reports' });
  }

  const { title, description, category } = req.body;
  const userId = req.user.id;

  try {
   
    const [userRows] = await pool.query('SELECT * FROM Users WHERE id = ?', [userId]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    await pool.execute(
      `INSERT INTO Reports (title, description, category, user_id) VALUES (?, ?, ?, ?)`,
      [title, description, category, userId]
    );

    await pool.query(
      `INSERT INTO UserLog (user_id, username, status, report_activity, description)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, user.name, 'active', 'raised', `${user.name} posted a report`]
    );

    const [admins] = await pool.query('SELECT email FROM Users WHERE role = "admin"');

    if (admins.length > 0) {
      const subject = 'New Report Submitted';
      const text = `
New Report Submission Notification

Employee Name : ${user.name}
Employee Email: ${user.email}
Employee ID   : ${user.id}

Report Details:
--------------------------
Title       : ${title}
Category    : ${category}
Description : ${description}

Submitted At: ${new Date().toLocaleString()}

Please log in to the admin dashboard to review this report.
`;

      await sendEmailToAdmins(admins, subject, text);
    }

    res.status(201).json({ message: 'Report created and admins notified' });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const GetReports = async (req, res) => {
  try {
    let reports;

    if (req.user.role === 'admin') {
      const [rows] = await pool.execute('SELECT * FROM Reports');
      reports = rows;
    } else {
      const [rows] = await pool.execute('SELECT * FROM Reports WHERE user_id = ?', [req.user.id]);
      reports = rows;
    }
    if(!reports || reports.length === 0) {
      return res.status(404).json({ message: 'No reports found' });
    }else{
        res.status(200).json(reports);
    }
    
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
export const UpdateReport = async (req, res) => {
  const reportId = req.params.id;
  const { status } = req.body;


  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can update status' });
  }

  
  const validStatuses = ['open', 'under review', 'resolved'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status value' });
  }

  try {
    const [result] = await pool.execute(
      'UPDATE Reports SET status = ?, updated_at = NOW() WHERE id = ?',
      [status, reportId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Report not found' });
    }

    res.json({ message: 'Report status updated successfully' });
  } catch (err) {
    console.error('Error updating report status:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
export const AddNote = async (req, res) => {
  const reportId = req.params.id;
  const { note } = req.body;

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can add notes' });
  }

  if (!note || note.trim() === "") {
    return res.status(400).json({ message: 'Note content is required' });
  }

  try {
    const [result] = await pool.execute(
      'INSERT INTO AdminNotes (report_id, note, admin_id) VALUES (?, ?, ?)',
      [reportId, note, req.user.id]
    );

    res.status(201).json({ message: 'Note added successfully', note_id: result.insertId });
  } catch (err) {
    console.error('Error adding note:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
export const ViewLogs = async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Only admins can view logs' });
  }

  try {
    const [logs] = await pool.query('SELECT * FROM UserLog ORDER BY timestamp DESC');
    
    if (!logs || logs.length === 0) {
      return res.status(404).json({ message: 'No logs found' });
    }
    
    res.status(200).json(logs);
  } catch (err) {
    console.error('Error fetching logs:', err);
    res.status(500).json({ message: 'Server error' });
  }
}