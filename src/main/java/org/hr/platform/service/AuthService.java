package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.RegisterRequest;
import org.hr.platform.dto.LoginRequest;
import org.hr.platform.dto.AuthResponse;
import org.hr.platform.model.Organization;
import org.hr.platform.model.User;
import org.hr.platform.repository.OrganizationRepository;
import org.hr.platform.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final OrganizationRepository organizationRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthResponse register(RegisterRequest request) {
        // Create or fetch org
        Organization organization = organizationRepository
                .findByName(request.getOrganizationName())
                .orElseGet(() -> {
                    Organization newOrg = Organization.builder()
                            .name(request.getOrganizationName())
                            .build();
                    return organizationRepository.save(newOrg);
                });

        // Create user
        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .organization(organization)
                .build();

        userRepository.save(user);

        // Generate token
        String jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt);
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getEmail(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String jwt = jwtService.generateToken(user);
        return new AuthResponse(jwt);
    }
}
