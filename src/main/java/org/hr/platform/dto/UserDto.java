package org.hr.platform.dto;

import lombok.Builder;
import org.hr.platform.enums.Role;
import org.hr.platform.model.User;

@Builder
public class UserDto {
    private Long id;
    private String email;
    private Role role;
    private Long organizationId;
    private boolean firstLogin;

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .organizationId(user.getOrganization().getId())
                .firstLogin(user.isFirstLogin())
                .build();
    }

    // Getters (or use Lombok @Getter if needed)
    public Long getId() { return id; }
    public String getEmail() { return email; }
    public Role getRole() { return role; }
    public Long getOrganizationId() { return organizationId; }
    public boolean isFirstLogin() { return firstLogin; }
}
