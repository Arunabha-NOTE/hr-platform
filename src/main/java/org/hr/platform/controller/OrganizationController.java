package org.hr.platform.controller;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateOrganizationRequest;
import org.hr.platform.service.OrganizationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/organizations")
@RequiredArgsConstructor
public class OrganizationController {

    private final OrganizationService organizationService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ADMIN', 'SUPERADMIN')")
    public ResponseEntity<?> getAllOrganizations() {
        return ResponseEntity.ok(organizationService.getAllOrganizations());
    }

    @PostMapping
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> createOrganization(@RequestBody CreateOrganizationRequest request) {
        organizationService.createOrganization(request);
        return ResponseEntity.ok("Organization created successfully");
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAuthority('SUPERADMIN')")
    public ResponseEntity<String> deleteOrganization(@PathVariable Long id) {
        organizationService.deleteOrganization(id);
        return ResponseEntity.ok("Organization deleted successfully");
    }
}
