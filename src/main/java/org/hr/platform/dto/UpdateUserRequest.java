package org.hr.platform.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hr.platform.enums.Role;

@Data
public class UpdateUserRequest {
    @Email(message = "Email should be valid")
    private String email;

    private Role role;

    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;
}
