import express from 'express';
import { RegisterUser , LoginUser} from '../Controller/User.js';
const User = express.Router();
User.post('/register', RegisterUser);
User.post('/login', LoginUser);
export default User;


