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
    await pool.query(
      'INSERT INTO Users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, role]
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
    if (!user) return res.status(401).json({ msg: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ msg: 'Invalid credentials' });

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ msg: 'Error', error: err });
  }
};

