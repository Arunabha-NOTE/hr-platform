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
        // Create default organization if it doesn't exist
        Organization platformOrg = organizationRepository.findByName("Platform Corp")
                .orElseGet(() -> {
                    log.info("Creating default organization: Platform Corp");
                    Organization org = Organization.builder()
                            .name("Platform Corp")
                            .description("Default platform organization")
                            .build();
                    return organizationRepository.save(org);
                });

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

        // Create default admin as regular user (not SuperAdmin)
        if (!userRepository.findByEmail("admin@platform.com").isPresent()) {
            log.info("Creating default admin user in Users table");
            User admin = User.builder()
                    .email("admin@platform.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .organization(platformOrg)
                    .firstLogin(false)
                    .build();
            userRepository.save(admin);
            log.info("Admin created with email: admin@platform.com, password: admin123");
        }

        log.info("Data seeding completed successfully");
    }
}
