package org.hr.platform.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.hr.platform.enums.Role;
import org.hr.platform.model.Organization;
import org.hr.platform.model.SuperAdmin;
import org.hr.platform.model.User;
import org.hr.platform.repository.OrganizationRepository;
import org.hr.platform.repository.SuperAdminRepository;
import org.hr.platform.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final OrganizationRepository organizationRepository;
    private final UserRepository userRepository;
    private final SuperAdminRepository superAdminRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        seedData();
    }

    private void seedData() {
        // Create multiple organizations
        Organization techCorp = createOrganizationIfNotExists(
            "Tech Corp",
            "A leading technology company specializing in software solutions"
        );

        Organization healthPlus = createOrganizationIfNotExists(
            "Health Plus",
            "Healthcare services and medical technology provider"
        );

        Organization eduSystems = createOrganizationIfNotExists(
            "Edu Systems",
            "Educational technology and e-learning platform company"
        );

        // Create superadmin in separate SuperAdmin table
        if (!superAdminRepository.findByEmail("superadmin@platform.com").isPresent()) {
            log.info("Creating superadmin user in SuperAdmin table");
            SuperAdmin superadmin = SuperAdmin.builder()
                    .email("superadmin@platform.com")
                    .password(passwordEncoder.encode("superadmin123"))
                    .firstName("Super")
                    .lastName("Admin")
                    .firstLogin(false)
                    .active(true)
                    .build();
            superAdminRepository.save(superadmin);
            log.info("SuperAdmin created with email: superadmin@platform.com, password: superadmin123");
        }

        // Seed users for Tech Corp
        createUsersForOrganization(techCorp, "techcorp.com");

        // Seed users for Health Plus
        createUsersForOrganization(healthPlus, "healthplus.com");

        // Seed users for Edu Systems
        createUsersForOrganization(eduSystems, "edusystems.com");

        log.info("Data seeding completed successfully");
    }

    private Organization createOrganizationIfNotExists(String name, String description) {
        return organizationRepository.findByName(name)
                .orElseGet(() -> {
                    log.info("Creating organization: {}", name);
                    Organization org = Organization.builder()
                            .name(name)
                            .description(description)
                            .build();
                    return organizationRepository.save(org);
                });
    }

    private void createUsersForOrganization(Organization organization, String domain) {
        String orgPrefix = organization.getName().toLowerCase().replace(" ", "");

        // Create Admin for the organization
        createUserIfNotExists(
            "admin@" + domain,
            "admin123",
            Role.ADMIN,
            organization,
            "Admin for " + organization.getName()
        );

        // Create Manager for the organization
        createUserIfNotExists(
            "manager@" + domain,
            "manager123",
            Role.MANAGER,
            organization,
            "Manager for " + organization.getName()
        );

        // Create multiple Employees for the organization
        createUserIfNotExists(
            "employee1@" + domain,
            "employee123",
            Role.EMPLOYEE,
            organization,
            "Employee 1 for " + organization.getName()
        );

        createUserIfNotExists(
            "employee2@" + domain,
            "employee123",
            Role.EMPLOYEE,
            organization,
            "Employee 2 for " + organization.getName()
        );

        createUserIfNotExists(
            "employee3@" + domain,
            "employee123",
            Role.EMPLOYEE,
            organization,
            "Employee 3 for " + organization.getName()
        );

        // Create additional Manager if organization is Tech Corp
        if ("Tech Corp".equals(organization.getName())) {
            createUserIfNotExists(
                "manager2@" + domain,
                "manager123",
                Role.MANAGER,
                organization,
                "Senior Manager for " + organization.getName()
            );
        }
    }

    private void createUserIfNotExists(String email, String password, Role role, Organization organization, String description) {
        if (!userRepository.findByEmail(email).isPresent()) {
            log.info("Creating {} user: {} for organization: {}", role, email, organization.getName());
            User user = User.builder()
                    .email(email)
                    .password(passwordEncoder.encode(password))
                    .role(role)
                    .organization(organization)
                    .firstLogin(false) // Set to false for easier testing, change to true if you want first login flow
                    .build();
            userRepository.save(user);
            log.info("{} created with email: {}, password: {}", role, email, password);
        }
    }
}
