
CREATE DATABASE EmployeeManagement;

USE EmployeeManagement;

CREATE TABLE IF NOT EXISTS employees (
    employee_id VARCHAR(20) PRIMARY KEY,
    employee_name VARCHAR(50) NOT NULL,
    email VARCHAR(50) NOT NULL UNIQUE,
    mobile_number VARCHAR(15),
    department VARCHAR(20) NOT NULL,
    designation VARCHAR(30),
    salary DECIMAL(10,2),
    joining_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE employee_sequence (
    sequence_id INT AUTO_INCREMENT PRIMARY KEY,
    year_code VARCHAR(2) NOT NULL,
    department_code VARCHAR(10) NOT NULL,
    last_number INT NOT NULL DEFAULT 0,
    UNIQUE (year_code, department_code)
);
