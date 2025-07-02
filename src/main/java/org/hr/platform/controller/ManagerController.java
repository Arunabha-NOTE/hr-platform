package org.hr.platform.controller;

import lombok.RequiredArgsConstructor;
import org.hr.platform.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final UserService userService;

    @GetMapping("/employees")
    @PreAuthorize("hasAuthority('MANAGER')")
    public ResponseEntity<?> getEmployeesInOrg(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getEmployeesInOrg(userDetails.getUsername()));
    }
}
