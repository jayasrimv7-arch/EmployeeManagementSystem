package com.ems.employeemanagement.dto;

public record LoginRequest(
        String username,
        String password
) {
}