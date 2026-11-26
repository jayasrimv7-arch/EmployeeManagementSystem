
package com.ems.employeemanagement.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.ems.employeemanagement.entity.Employee;

public interface EmployeeRepository extends JpaRepository<Employee, String> {

    // Check whether an email already exists
    boolean existsByEmail(String email);

    // Check duplicate email while excluding the current employee
    boolean existsByEmailAndEmployeeIdNot(String email, String employeeId);

    // Search employees by name and department
    @Query("""
        SELECT e FROM Employee e
        WHERE (:name IS NULL OR
               LOWER(e.employeeName) LIKE LOWER(CONCAT('%', :name, '%')))
        AND (:department IS NULL OR
             LOWER(e.department) = LOWER(:department))
        """)
    List<Employee> searchEmployees(
            @Param("name") String name,
            @Param("department") String department
    );
}
