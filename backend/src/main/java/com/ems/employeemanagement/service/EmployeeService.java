
package com.ems.employeemanagement.service;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Statement;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import com.ems.employeemanagement.entity.Employee;
import com.ems.employeemanagement.repository.EmployeeRepository;

@Service
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final JdbcTemplate jdbcTemplate;

    private final Map<String, String> departmentCodes = Map.of(
            "IT", "IT",
            "FINANCE", "FIN",
            "HR", "HR",
            "PRODUCTION", "PROD"
    );

    public EmployeeService(EmployeeRepository employeeRepository,
                           JdbcTemplate jdbcTemplate) {
        this.employeeRepository = employeeRepository;
        this.jdbcTemplate = jdbcTemplate;
    }

    // Generate employee ID department-wise and year-wise

@Transactional
public String generateEmployeeId(String department) {

    String departmentCode = departmentCodes.get(
            department.trim().toUpperCase()
    );

    if (departmentCode == null) {
        throw new ResponseStatusException(
                HttpStatus.BAD_REQUEST,
                "Invalid department"
        );
    }

    String yearCode = String.valueOf(
            LocalDate.now().getYear()
    ).substring(2);

    return jdbcTemplate.execute((Connection connection) -> {

        String insertSql = """
                INSERT INTO employee_sequence
                (year_code, department_code, last_number)
                VALUES (?, ?, 1)
                ON DUPLICATE KEY UPDATE
                last_number = last_number + 1
                """;

        try (PreparedStatement ps =
                     connection.prepareStatement(insertSql)) {

            ps.setString(1, yearCode);
            ps.setString(2, departmentCode);
            ps.executeUpdate();
        }

        String selectSql = """
                SELECT last_number
                FROM employee_sequence
                WHERE year_code = ?
                AND department_code = ?
                """;

        try (PreparedStatement ps =
                     connection.prepareStatement(selectSql)) {

            ps.setString(1, yearCode);
            ps.setString(2, departmentCode);

            try (ResultSet rs = ps.executeQuery()) {

                if (rs.next()) {
                    int number = rs.getInt("last_number");

                    return yearCode + departmentCode
                            + String.format("%02d", number);
                }
            }
        }

        throw new IllegalStateException(
                "Unable to generate employee ID"
        );
    });
}


    // Add employee
    @Transactional
    public Employee addEmployee(Employee employee) {

        if (employeeRepository.existsByEmail(employee.getEmail())) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        String employeeId = generateEmployeeId(employee.getDepartment());
        employee.setEmployeeId(employeeId);

        return employeeRepository.save(employee);
    }

    // Get all employees
    public List<Employee> getAllEmployees() {
        return employeeRepository.findAll();
    }

    // Get employee by ID
    public Employee getEmployeeById(String employeeId) {

        return employeeRepository.findById(employeeId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Employee not found"
                ));
    }

    // Update employee
    @Transactional
    public Employee updateEmployee(String employeeId, Employee updatedEmployee) {

        Employee existingEmployee = getEmployeeById(employeeId);

        if (employeeRepository.existsByEmailAndEmployeeIdNot(
                updatedEmployee.getEmail(), employeeId)) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "Email already exists"
            );
        }

        existingEmployee.setEmployeeName(updatedEmployee.getEmployeeName());
        existingEmployee.setEmail(updatedEmployee.getEmail());
        existingEmployee.setMobileNumber(updatedEmployee.getMobileNumber());
        existingEmployee.setDepartment(updatedEmployee.getDepartment());
        existingEmployee.setDesignation(updatedEmployee.getDesignation());
        existingEmployee.setSalary(updatedEmployee.getSalary());
        existingEmployee.setJoiningDate(updatedEmployee.getJoiningDate());

        return employeeRepository.save(existingEmployee);
    }

    // Delete employee
    @Transactional
    public void deleteEmployee(String employeeId) {

        Employee employee = getEmployeeById(employeeId);
        employeeRepository.delete(employee);
    }

    // Search employees by name and department
    public List<Employee> searchEmployees(String name, String department) {

        String searchName = (name == null || name.isBlank()) ? null : name.trim();
        String searchDepartment = (department == null || department.isBlank())
                ? null : department.trim();

        return employeeRepository.searchEmployees(searchName, searchDepartment);
    }
}
