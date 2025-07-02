package org.hr.platform.security;

import lombok.RequiredArgsConstructor;
import org.hr.platform.model.SuperAdmin;
import org.hr.platform.model.User;
import org.hr.platform.repository.SuperAdminRepository;
import org.hr.platform.repository.UserRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final SuperAdminRepository superAdminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // First, try to find as SuperAdmin
        return superAdminRepository.findByEmail(email)
                .map(superAdmin -> org.springframework.security.core.userdetails.User
                        .withUsername(superAdmin.getEmail())
                        .password(superAdmin.getPassword())
                        .authorities("SUPERADMIN")
                        .build())
                .orElseGet(() ->
                    // If not SuperAdmin, try regular user
                    userRepository.findByEmail(email)
                            .map(user -> org.springframework.security.core.userdetails.User
                                    .withUsername(user.getEmail())
                                    .password(user.getPassword())
                                    .authorities(user.getRole().name())
                                    .build())
                            .orElseThrow(() -> new UsernameNotFoundException("User not found"))
                );
    }
}
