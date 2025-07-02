package org.hr.platform.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String refreshToken;
    private boolean firstLogin;

    // Keep backwards compatibility constructor
    public AuthResponse(String token) {
        this.token = token;
        this.refreshToken = null;
        this.firstLogin = false;
    }
}
