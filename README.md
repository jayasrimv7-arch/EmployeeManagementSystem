Employee Management System

1. Project Overview

The Employee Management System is a web-based application developed to manage employee information.

The application allows administrators to add, view, update, delete, and search employee records. Employees can log in and view their own details.

2. Technologies Used

Frontend
- React.js
- JavaScript
- HTML
- CSS
- Vite

Backend
- Java 17
- Spring Boot
- Spring Data JPA
- REST APIs
- Gradle

Database
- MySQL

API Testing
- Postman

3. Project Structure

EmployeeManagementSystem_Submission/
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── index.html
│
├── backend/
│   ├── src/
│   ├── build.gradle
│   └── gradlew.bat
│
├── database/
│   └── database.sql
│
├── screenshots/
│
├── postman/
│   └── EmployeeManagementSystem.postman_collection.json
│
└── README.md

 4. Database Setup

1. Open MySQL Workbench.
2. Execute the SQL script available in `database/database.sql`.
3. The script creates the `EmployeeManagement` database.
4. It creates the following tables:
   - employees
   - employee_sequence

5. Backend Setup

1. Open the backend project in Spring Tool Suite (STS) and run the Spring Boot application.
2. Configure the MySQL database connection in `application.properties`.
3. Update the database username and password according to your MySQL configuration.
4. Run the Spring Boot application.

Backend URL:

`http://localhost:8080`

 6. Frontend Setup

1. Open the frontend folder in VS Code.
2. Open the terminal.
3. Install dependencies:
npm install

4. Start the React application:

npm run dev

Frontend URL:

`http://localhost:5173`

7. API Endpoints

| HTTP Method | API Endpoint                | Description |

| GET         | /api/employees              | Retrieve all employees 
| GET         | /api/employees/{employeeId} | Retrieve employee by ID 
| POST        | /api/employees              | Create a new employee 
| PUT         | /api/employees/{employeeId} | Update employee details 
| DELETE      | /api/employees/{employeeId} | Delete an employee 

 8. Login Details

Admin Login
- Username: Admin
- Password: Admin

Employee Login
- Username: Employee ID
- Password: Employee ID

Employee login requires an existing Employee ID in the database.

 9. Employee ID Generation

Employee IDs are generated automatically based on the year and department code.

Examples:
- 26IT01
- 26HR01
- 26FIN01
- 26PROD01

 10. Screenshots

Application screenshots are available in the `screenshots` folder.

11. Postman API Testing

The Postman API testing screenshots are available in the `postman` folder.

12. Author

Employee Management System - React.js and Spring Boot Project
