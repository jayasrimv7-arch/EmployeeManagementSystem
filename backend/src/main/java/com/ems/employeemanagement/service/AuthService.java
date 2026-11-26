package com.ems.employeemanagement.service;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ems.employeemanagement.dto.LoginRequest;
import com.ems.employeemanagement.dto.LoginResponse;
import com.ems.employeemanagement.entity.Employee;
import com.ems.employeemanagement.repository.EmployeeRepository;

@Service
public class AuthService {

    private final EmployeeRepository employeeRepository;

    public AuthService(EmployeeRepository employeeRepository) {
        this.employeeRepository = employeeRepository;
    }

    public LoginResponse login(LoginRequest request) {

        String username = request.username() == null
                ? "" : request.username().trim();

        String password = request.password() == null
                ? "" : request.password().trim();

        // Admin login
        if (username.equals("Admin") && password.equals("Admin")) {
            return new LoginResponse(
                    "Admin login successful",
                    "ADMIN",
                    null
            );
        }

        // Employee login: Employee ID is both username and password
        if (!username.isEmpty() && username.equals(password)) {

            Employee employee = employeeRepository.findById(username)
                    .orElseThrow(() -> new ResponseStatusException(
                            HttpStatus.UNAUTHORIZED,
                            "Invalid Employee ID or Password"
                    ));

            return new LoginResponse(
                    "Employee login successful",
                    "EMPLOYEE",
                    employee
          );
        }

        throw new ResponseStatusException(
                HttpStatus.UNAUTHORIZED,
                "Invalid Username or Password"
        );
    }
}