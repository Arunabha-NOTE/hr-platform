package org.hr.platform.dto;

import lombok.Builder;
import lombok.Getter;
import org.hr.platform.enums.Role;
import org.hr.platform.model.User;

@Builder
@Getter
public class UserDto {
    private Long id;
    private String email;
    private Role role;
    private boolean firstLogin;
    private OrganizationDto organization;

    @Builder
    @Getter
    public static class OrganizationDto {
        private Long id;
        private String name;

        public static OrganizationDto from(org.hr.platform.model.Organization organization) {
            if (organization == null) return null;
            return OrganizationDto.builder()
                    .id(organization.getId())
                    .name(organization.getName())
                    .build();
        }
    }

    public static UserDto from(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .role(user.getRole())
                .firstLogin(user.isFirstLogin())
                .organization(OrganizationDto.from(user.getOrganization()))
                .build();
    }
}
