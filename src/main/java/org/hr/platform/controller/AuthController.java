package org.hr.platform.controller;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.AuthResponse;
import org.hr.platform.dto.LoginRequest;
import org.hr.platform.dto.CreateUserRequest;
import org.hr.platform.model.User;
import org.hr.platform.service.AuthService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/create_user")
    public ResponseEntity<AuthResponse> register(@RequestBody CreateUserRequest request, @AuthenticationPrincipal User admin) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }
}
