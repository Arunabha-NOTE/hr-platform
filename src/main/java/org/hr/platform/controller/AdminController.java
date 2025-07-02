package org.hr.platform.controller;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.dto.UpdateUserRequest;
import org.hr.platform.service.AdminService;
import org.hr.platform.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.security.access.prepost.PreAuthorize;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserService userService;
    private final AdminService adminService;

    @GetMapping("/users")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<?> getAllUsersInOrg(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(adminService.listAllUsersInOrg());
    }

    @PutMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id,
            @RequestBody UpdateUserRequest request
    ) {
        userService.updateUser(userDetails.getUsername(), id, request);
        return ResponseEntity.ok("User updated successfully");
    }

    @PostMapping("/create-user")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> createUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody CreateUserRequest request
    ) {
        adminService.createUser(request);
        return ResponseEntity.ok("User created successfully");
    }

    @DeleteMapping("/users/{id}")
    @PreAuthorize("hasAuthority('ADMIN')")
    public ResponseEntity<String> deleteUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long id
    ) {
        adminService.deleteUser(id);
        return ResponseEntity.ok("User deleted successfully");
    }
}
