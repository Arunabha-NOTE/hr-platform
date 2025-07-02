package org.hr.platform.controller;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateOrganizationRequest;
import org.hr.platform.dto.CreateSuperAdminRequest;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.dto.UpdateUserRequest;
import org.hr.platform.service.OrganizationService;
import org.hr.platform.service.SuperAdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/superadmin")
@RequiredArgsConstructor
public class SuperAdminController {

    private final SuperAdminService superAdminService;
    private final OrganizationService organizationService;

    // SuperAdmin management
    @PostMapping("/create-superadmin")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> createSuperAdmin(@RequestBody CreateSuperAdminRequest request) {
        superAdminService.createSuperAdmin(request);
        return ResponseEntity.ok("SuperAdmin created successfully");
    }

    @GetMapping("/superadmins")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllSuperAdmins() {
        return ResponseEntity.ok(superAdminService.getAllSuperAdmins());
    }

    @DeleteMapping("/superadmins/{id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> deleteSuperAdmin(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id) {
        superAdminService.deleteSuperAdmin(userDetails.getUsername(), id);
        return ResponseEntity.ok("SuperAdmin deleted successfully");
    }

    // Organization management
    @GetMapping("/organizations")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllOrganizations() {
        return ResponseEntity.ok(superAdminService.getAllOrganizations());
    }

    @PostMapping("/organizations")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> createOrganization(@RequestBody CreateOrganizationRequest request) {
        organizationService.createOrganization(request);
        return ResponseEntity.ok("Organization created successfully");
    }

    @DeleteMapping("/organizations/{id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok("Organization deleted successfully");
    }

    // Global user management (across all organizations)
    @GetMapping("/users")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getAllUsers() {
        return ResponseEntity.ok(superAdminService.getAllUsers());
    }

    @GetMapping("/users/organization/{orgId}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<?> getUsersByOrganization(@PathVariable Long orgId) {
        return ResponseEntity.ok(superAdminService.getUsersByOrganization(orgId));
    }

    @PostMapping("/users/organization/{orgId}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> createUserInOrganization(
            @PathVariable Long orgId,
            @RequestBody CreateUserRequest request) {
        superAdminService.createUserInOrganization(orgId, request);
        return ResponseEntity.ok("User created successfully");
    }

    @PutMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateUserRequest request) {
        superAdminService.updateUserAcrossOrganizations(userId, request);
        return ResponseEntity.ok("User updated successfully");
    }

    @DeleteMapping("/users/{userId}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Long userId) {
        superAdminService.deleteUserAcrossOrganizations(userId);
        return ResponseEntity.ok("User deleted successfully");
    }
}
