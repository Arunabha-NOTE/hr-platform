package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.dto.LoginRequest;
import org.hr.platform.enums.Role;
import org.hr.platform.model.User;
import org.hr.platform.repository.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.security.access.AccessDeniedException;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public String createUser(CreateUserRequest request, User creator) {
        if (creator.getRole() != Role.ADMIN) {
            throw new AccessDeniedException("Only admins can create users.");
        }

        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new IllegalArgumentException("Email already exists.");
        }

        User user = User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .organization(creator.getOrganization())
                .build();

        userRepository.save(user);
        return "User created successfully in organization: " + creator.getOrganization().getName();
    }

    public String login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        return jwtService.generateToken(user);
    }
}
