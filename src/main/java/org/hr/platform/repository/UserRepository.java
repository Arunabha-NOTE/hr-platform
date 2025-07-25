package org.hr.platform.repository;

import org.hr.platform.enums.Role;
import org.hr.platform.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByOrganizationId(Long organizationId);
    List<User> findByOrganizationIdAndRole(Long organizationId, Role role);
}
