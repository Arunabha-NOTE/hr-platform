package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateOrganizationRequest;
import org.hr.platform.model.Organization;
import org.hr.platform.repository.OrganizationRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OrganizationService {

    private final OrganizationRepository organizationRepository;

    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    public Optional<Organization> getOrganizationById(Long id) {
        return organizationRepository.findById(id);
    }

    public Organization save(Organization org) {
        return organizationRepository.save(org);
    }

    public void delete(Long id) {
        organizationRepository.deleteById(id);
    }

    public boolean existsByName(String name) {
        return organizationRepository.existsByName(name);
    }

    public void createOrganization(CreateOrganizationRequest request) {
        if (existsByName(request.getName())) {
            throw new RuntimeException("Organization with this name already exists");
        }

        Organization organization = Organization.builder()
                .name(request.getName())
                .description(request.getDescription())
                .build();

        organizationRepository.save(organization);
    }

    public void deleteOrganization(Long id) {
        Organization organization = organizationRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Organization not found"));

        organizationRepository.delete(organization);
    }
}
