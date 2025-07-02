package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final JwtService jwtService;

    // In-memory storage for refresh tokens (for production, use Redis or database)
    private final Map<String, String> refreshTokenStore = new ConcurrentHashMap<>();
    private final Map<String, String> blacklistedTokens = new ConcurrentHashMap<>();

    public String generateRefreshToken(String email) {
        String refreshToken = UUID.randomUUID().toString();
        refreshTokenStore.put(refreshToken, email);
        return refreshToken;
    }

    public String getUserEmailFromRefreshToken(String refreshToken) {
        return refreshTokenStore.get(refreshToken);
    }

    public boolean isValidRefreshToken(String refreshToken) {
        return refreshTokenStore.containsKey(refreshToken) && !blacklistedTokens.containsKey(refreshToken);
    }

    public void invalidateRefreshToken(String refreshToken) {
        refreshTokenStore.remove(refreshToken);
        blacklistedTokens.put(refreshToken, "blacklisted");
    }

    public void blacklistToken(String token) {
        blacklistedTokens.put(token, "blacklisted");
    }

    public boolean isTokenBlacklisted(String token) {
        return blacklistedTokens.containsKey(token);
    }
}
