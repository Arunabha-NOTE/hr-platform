package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.ChangePasswordRequest;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.dto.UpdateUserRequest;
import org.hr.platform.dto.UserDto;
import org.hr.platform.model.Organization;
import org.hr.platform.enums.Role;
import org.hr.platform.model.User;
import org.hr.platform.repository.OrganizationRepository;
import org.hr.platform.repository.UserRepository;
import org.hr.platform.util.SecurityUtil;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

import static java.util.stream.Collectors.toList;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    public List<UserDto> getAllUsersForCurrentOrg() {
        User current = getCurrentUser();
        return userRepository.findByOrganizationId(current.getOrganization().getId())
                .stream()
                .map(UserDto::from)
                .collect(toList());
    }

    public UserDto getMyProfile() {
        return UserDto.from(getCurrentUser());
    }

    public UserDto createUser(CreateUserRequest request) {
        User current = getCurrentUser();

        if (current.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only Admins can create users.");
        }

        Organization org = current.getOrganization();

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .organization(org)
                .firstLogin(true)
                .build();

        userRepository.save(user);
        return UserDto.from(user);
    }

    public User getCurrentUser() {
        String email = SecurityUtil.getCurrentUserEmail();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public List<UserDto> getUsersInOrg(String adminEmail) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        return userRepository.findByOrganizationId(admin.getOrganization().getId())
                .stream()
                .map(UserDto::from)
                .collect(toList());
    }

    public void updateUser(String adminEmail, Long userId, UpdateUserRequest request) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only Admins can update users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure user belongs to same organization
        if (!user.getOrganization().getId().equals(admin.getOrganization().getId())) {
            throw new AccessDeniedException("Cannot update user from different organization");
        }

        if (request.getEmail() != null) {
            user.setEmail(request.getEmail());
        }
        if (request.getRole() != null) {
            user.setRole(request.getRole());
        }
        if (request.getPassword() != null) {
            user.setPassword(passwordEncoder.encode(request.getPassword()));
            user.setFirstLogin(true);
        }

        userRepository.save(user);
    }

    public void deleteUser(String adminEmail, Long userId) {
        User admin = userRepository.findByEmail(adminEmail)
                .orElseThrow(() -> new RuntimeException("Admin not found"));

        if (admin.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only Admins can delete users");
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Ensure user belongs to same organization
        if (!user.getOrganization().getId().equals(admin.getOrganization().getId())) {
            throw new AccessDeniedException("Cannot delete user from different organization");
        }

        // Prevent admin from deleting themselves
        if (user.getId().equals(admin.getId())) {
            throw new AccessDeniedException("Cannot delete yourself");
        }

        userRepository.delete(user);
    }

    // Methods expected by ManagerController
    public List<UserDto> getEmployeesInOrg(String managerEmail) {
        User manager = userRepository.findByEmail(managerEmail)
                .orElseThrow(() -> new RuntimeException("Manager not found"));

        return userRepository.findByOrganizationIdAndRole(manager.getOrganization().getId(), Role.EMPLOYEE)
                .stream()
                .map(UserDto::from)
                .collect(toList());
    }

    // Methods expected by UserController
    public UserDto getProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return UserDto.from(user);
    }

    public void changePassword(String email, ChangePasswordRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
            throw new RuntimeException("Current password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        user.setFirstLogin(false);
        userRepository.save(user);
    }
}
