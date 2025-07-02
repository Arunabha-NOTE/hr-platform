package org.hr.platform.repository;

import org.hr.platform.model.Organization;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface OrganizationRepository extends JpaRepository<Organization, Long> {
    Optional<Organization> findByName(String organizationName);
    boolean existsByName(String name);
}
