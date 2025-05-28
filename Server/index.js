import express from 'express';
import pool from './Models/db.js';
import UserRoutes from './Routes/UserRoute.js';
import ReportRoute from './Routes/ReportRoute.js';

const app = express();
app.use(express.json());
app.use("/api", UserRoutes);
app.use("/api", ReportRoute);

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    const connection = await pool.getConnection();
    console.log('DB connection successful');
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error(' DB connection failed:', err);
    process.exit(1);
  }
}

startServer();
