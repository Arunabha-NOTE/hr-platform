package org.hr.platform.dto;

import lombok.Data;
import org.hr.platform.enums.Role;

@Data
public class UserProfileResponse {
    private Long id;
    private String email;
    private String firstName;
    private String lastName;
    private Role role;
    private Long organizationId;
}
