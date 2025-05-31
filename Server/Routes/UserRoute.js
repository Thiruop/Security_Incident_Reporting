import express from 'express';
import { RegisterUser , LoginUser,LogoutUser} from '../Controller/User.js';
import { authenticateToken } from '../Middleware/Authentication.js';
const User = express.Router();
User.post('/register', RegisterUser);
User.post('/login', LoginUser);
User.post("/logout",authenticateToken,LogoutUser);
export default User;


