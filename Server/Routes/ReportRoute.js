import express from 'express';
import { authenticateToken } from '../Middleware/Authentication.js';
import { PostReport , GetReports, UpdateReport,AddNote} from '../Controller/Report.js';
const ReportRoute = express.Router();
ReportRoute.post('/reports',authenticateToken, PostReport);
ReportRoute.get('/reports', authenticateToken, GetReports);
ReportRoute.put('/reports/:id/status', authenticateToken, UpdateReport);
ReportRoute.post('/reports/:id/note', authenticateToken, AddNote);
export default ReportRoute;
