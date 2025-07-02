package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.dto.UserDto;
import org.hr.platform.model.Organization;
import org.hr.platform.enums.Role;
import org.hr.platform.model.User;
import org.hr.platform.repository.OrganizationRepository;
import org.hr.platform.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserService userService;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> listAllUsersInOrg() {
        Long orgId = userService.getCurrentUser().getOrganization().getId();
        return userRepository.findByOrganizationId(orgId)
                .stream()
                .map(UserDto::from)
                .toList();
    }

    // Methods expected by AdminController
    public void createUserForOrg(String adminEmail, CreateUserRequest request) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only Admins can create users");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .organization(admin.getOrganization())
                .firstLogin(true)
                .build();

        userRepository.save(user);
    }

    public UserDto createUser(CreateUserRequest request) {
        User currentAdmin = userService.getCurrentUser();

        Organization org = currentAdmin.getOrganization();

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .firstLogin(true)
                .organization(org)
                .build();

        return UserDto.from(userRepository.save(user));
    }

    public void deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getOrganization().getId().equals(userService.getCurrentUser().getOrganization().getId())) {
            throw new RuntimeException("Unauthorized");
        }

        userRepository.delete(user);
    }
}
