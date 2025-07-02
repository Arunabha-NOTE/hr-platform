package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.AuthRequest;
import org.hr.platform.dto.AuthResponse;
import org.hr.platform.dto.RefreshTokenRequest;
import org.hr.platform.dto.TokenResponse;
import org.hr.platform.model.SuperAdmin;
import org.hr.platform.model.User;
import org.hr.platform.repository.SuperAdminRepository;
import org.hr.platform.repository.UserRepository;
import org.hr.platform.service.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final SuperAdminRepository superAdminRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final RefreshTokenService refreshTokenService;

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // First, check if it's a SuperAdmin
        return superAdminRepository.findByEmail(request.getEmail())
                .map(superAdmin -> {
                    String token = jwtService.generateTokenForSuperAdmin(superAdmin);
                    String refreshToken = refreshTokenService.generateRefreshToken(superAdmin.getEmail());
                    return new AuthResponse(token, refreshToken, superAdmin.isFirstLogin());
                })
                .orElseGet(() -> {
                    // If not SuperAdmin, check regular user
                    User user = userRepository.findByEmail(request.getEmail())
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    String token = jwtService.generateToken(user);
                    String refreshToken = refreshTokenService.generateRefreshToken(user.getEmail());
                    return new AuthResponse(token, refreshToken, user.isFirstLogin());
                });
    }

    public TokenResponse refreshToken(RefreshTokenRequest request) {
        String refreshToken = request.getRefreshToken();

        if (!refreshTokenService.isValidRefreshToken(refreshToken)) {
            throw new RuntimeException("Invalid refresh token");
        }

        String email = refreshTokenService.getUserEmailFromRefreshToken(refreshToken);

        // Check if it's a SuperAdmin
        return superAdminRepository.findByEmail(email)
                .map(superAdmin -> {
                    String newAccessToken = jwtService.generateTokenForSuperAdmin(superAdmin);
                    String newRefreshToken = refreshTokenService.generateRefreshToken(email);
                    refreshTokenService.invalidateRefreshToken(refreshToken);
                    return new TokenResponse(newAccessToken, newRefreshToken);
                })
                .orElseGet(() -> {
                    // If not SuperAdmin, check regular user
                    User user = userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"));

                    String newAccessToken = jwtService.generateToken(user);
                    String newRefreshToken = refreshTokenService.generateRefreshToken(email);
                    refreshTokenService.invalidateRefreshToken(refreshToken);
                    return new TokenResponse(newAccessToken, newRefreshToken);
                });
    }

    // Keep the existing method for backwards compatibility
    public AuthResponse authenticate(AuthRequest request) {
        return login(request);
    }
}
