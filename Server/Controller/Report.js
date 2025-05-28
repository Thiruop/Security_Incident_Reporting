import express from 'express';
import pool from '../Models/db.js';
export const PostReport =async (req, res) => {
  if (req.user.role !== 'employee') {
    return res.status(403).json({ message: 'Only employees can create reports' });
  }

  const { title, description, category } = req.body;
  const userId = req.user.id;

  try {
    await pool.execute(
      `INSERT INTO Reports (title, description, category, user_id) VALUES (?, ?, ?, ?)`,
      [title, description, category, userId]
    );

    res.status(201).json({ message: 'Report created successfully' });
  } catch (err) {
    console.error('Error creating report:', err);
    res.status(500).json({ message: 'Server error' });
  }
}
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