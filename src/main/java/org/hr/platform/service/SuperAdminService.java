package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateSuperAdminRequest;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.dto.UpdateUserRequest;
import org.hr.platform.dto.UserDto;
import org.hr.platform.enums.Role;
import org.hr.platform.model.Organization;
import org.hr.platform.model.SuperAdmin;
import org.hr.platform.model.User;
import org.hr.platform.repository.OrganizationRepository;
import org.hr.platform.repository.SuperAdminRepository;
import org.hr.platform.repository.UserRepository;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SuperAdminService {

    private final SuperAdminRepository superAdminRepository;
    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;

    // SuperAdmin CRUD operations
    public void createSuperAdmin(CreateSuperAdminRequest request) {
        if (superAdminRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("SuperAdmin with this email already exists");
        }

        SuperAdmin superAdmin = SuperAdmin.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .firstLogin(true)
                .active(true)
                .build();

        superAdminRepository.save(superAdmin);
    }

    public List<SuperAdmin> getAllSuperAdmins() {
        return superAdminRepository.findAll();
    }

    public void deleteSuperAdmin(String currentSuperAdminEmail, Long superAdminId) {
        SuperAdmin currentSuperAdmin = superAdminRepository.findByEmail(currentSuperAdminEmail)
                .orElseThrow(() -> new RuntimeException("Current SuperAdmin not found"));

        SuperAdmin targetSuperAdmin = superAdminRepository.findById(superAdminId)
                .orElseThrow(() -> new RuntimeException("SuperAdmin not found"));

        // Prevent SuperAdmin from deleting themselves
        if (currentSuperAdmin.getId().equals(targetSuperAdmin.getId())) {
            throw new AccessDeniedException("Cannot delete yourself");
        }

        superAdminRepository.delete(targetSuperAdmin);
    }

    // Organization management for SuperAdmins
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    // User management across ALL organizations for SuperAdmins
    public List<UserDto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    public List<UserDto> getUsersByOrganization(Long organizationId) {
        return userRepository.findByOrganizationId(organizationId)
                .stream()
                .map(UserDto::from)
                .collect(Collectors.toList());
    }

    public void createUserInOrganization(Long organizationId, CreateUserRequest request) {
        Organization organization = organizationRepository.findById(organizationId)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("User with this email already exists");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .organization(organization)
                .firstLogin(true)
                .build();

        userRepository.save(user);
    }

    public void updateUserAcrossOrganizations(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
            if (userRepository.findByEmail(request.getEmail()).isPresent()) {
                throw new RuntimeException("Email already exists");
            }
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

    public void deleteUserAcrossOrganizations(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        userRepository.delete(user);
    }
}
