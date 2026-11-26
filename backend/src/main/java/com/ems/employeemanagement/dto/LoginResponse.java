package com.ems.employeemanagement.dto;

import com.ems.employeemanagement.entity.Employee;

public class LoginResponse {

    private String message;
    private String role;
    private Employee employee;

    public LoginResponse(String message, String role, Employee employee) {
        this.message = message;
        this.role = role;
        this.employee = employee;
    }

    public String getMessage() {
        return message;
    }

    public String getRole() {
        return role;
    }

    public Employee getEmployee() {
        return employee;
    }
}