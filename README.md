**Overview**

The **Security Incident Reporting Application** is a system designed to assist employees in reporting system-related issues within their organization. Employees can submit detailed reports describing the problems they face. Once a report is submitted, the system automatically sends an email notification to the admin team, ensuring they are alerted in real-time.

Admins can log into the system to view and manage all incoming reports. They can update the status of each report **Open, Under Review, or Resolved** and add notes to keep the employee informed throughout the resolution process. Employees can track the status of their reported issues directly from their dashboard.

Both Employees and Admins have access to **role-specific dashboards** that provide a clear overview of all incidents based on their status. The system also includes **user activity tracking** so that admins can monitor login status, submitted reports, and interactions.

Additionally, the application includes a **filter option**, allowing users to easily sort and view reports based on categories, status improving usability and efficiency in managing large volumes of incident reports.

**Setup Instruction**

1.**Install MySQL Installer** - https://dev.mysql.com/downloads/installer/


2.**Install Node** - https://nodejs.org/en/download


3.**Paltform to run Application** - VScode - https://code.visualstudio.com/download


5.**DB Connections** - After Install MySQL Workbench open it click on the **connect to database** they have provided host,port number, username, password is your root
password, create DB name **IncidentReporting** cmd- **create database IncidentReporting;**


4.**NodeMailer to Send Notification** - for that we need Email Password we need to generate from the google account Manage Google Account -> Search App Password -> Give App Name -> it will generate the password so place it in the Backend env file **EMAIL_PASS**


5.**Generate jwt Token in Local Machine** - command - **node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"**


**Tech Stack Used**

1. **NodeJS (BackEnd) Version** - v22.14.0
2. **ReactJS Version** - 19.1.0
3. **MySQL Workbench 8.0 CE** - 8.0.42

**Security Feature Implemeted**

1. **React (Frontend):** All API calls are protected by checking for a valid JWT token. If the token is missing or invalid, the user is redirected to the login page.

2. **React (Frontend):** A graphical dashboard view is implemented for enhanced user experience and data visibility.
   
3. **React (Frontend):** XSS (Cross-Site Scripting) prevention is implemented through input sanitization and safe rendering practices.

4. **Node.js (Backend)**: JWT (JSON Web Token) is used for secure authentication, and user passwords are hashed using bcrypt before storing in the database.

5. **Node.js (Backend):** Unique user login is enforced based on email to prevent duplicate registrations.

6. **Node.js (Backend):** SQL Injection is prevented by using parameterized queries (e.g., ? placeholders with mysql2).

7. **Node.js (Backend):** CORS (Cross-Origin Resource Sharing) is properly configured to allow only authorized domains to access the API.

**Test Creditional** 

MySQL Workbench work locally so i have Register page so you can create the account and explore the both addmin and employee Dashboard


