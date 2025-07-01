package org.hr.platform.dto;

import lombok.Data;
import org.hr.platform.enums.Role;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private String organizationName;
    private Role role;
}
