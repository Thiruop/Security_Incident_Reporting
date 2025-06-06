import express from 'express';
import pool from '../Models/db.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

export const RegisterUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const [existing] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId;

    await pool.query(
      'INSERT INTO UserLog (user_id, username, status, report_activity, description) VALUES (?, ?, ?, ?, ?)',
      [userId, name, null, null, 'USER HAS BEEN REGISTERED']
    );

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('Error in /api/register:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


export const LoginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [rows] = await pool.query('SELECT * FROM Users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user) {
      await pool.query(
        'INSERT INTO UserLog (user_id, username, status, report_activity, description) VALUES (?, ?, ?, ?, ?)',
        [null, email, null, null, `${email} tried to log in (no user found)`]
      );
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      
      await pool.query(
        'INSERT INTO UserLog (user_id, username, status, report_activity, description) VALUES (?, ?, ?, ?, ?)',
        [user.id, user.name, null, null, `${user.name} tried to log in (wrong password)`]
      );
      return res.status(401).json({ msg: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id, role: user.role, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    await pool.query(
      'INSERT INTO UserLog (user_id, username, status, report_activity, description) VALUES (?, ?, ?, ?, ?)',
      [user.id, user.name, 'active', null, `${user.name} has been logged in`]
    );

    res.json({ token });
  } catch (err) {
    console.error('Error in /api/login:', err);
    res.status(500).json({ msg: 'Error', error: err });
  }
};
export const LogoutUser = async (req, res) => {
  try {
    const { id } = req.user;

    const [userRows] = await pool.query('SELECT * FROM Users WHERE id = ?', [id]);
    const user = userRows[0];
    if (!user) return res.status(404).json({ message: 'User not found' });

    const [logRows] = await pool.query(
      'SELECT status FROM UserLog WHERE user_id = ? ORDER BY id DESC LIMIT 1',
      [id]
    );

    const lastStatus = logRows.length > 0 ? logRows[0].status : null;

    if (lastStatus === 'inactive') {
      return res.status(200).json({ message: 'User already logged out' });
    }

    await pool.query(
      'INSERT INTO UserLog (user_id, username, status, report_activity, description) VALUES (?, ?, ?, ?, ?)',
      [user.id, user.name, 'inactive', null, `${user.name} has been logged out`]
    );

    res.json({ message: 'Logout successful (token should be deleted on client)' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ message: 'Server error during logout' });
  }
};
