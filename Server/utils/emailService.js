import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendEmailToAdmins = async (admins, subject, text) => {
  const emailList = admins.map(admin => admin.email).join(','); 
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: emailList,
    subject,
    text
  });
};
