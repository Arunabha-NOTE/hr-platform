package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.UserDto;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final UserService userService;

    public UserDto viewOwnProfile() {
        return UserDto.from(userService.getCurrentUser());
    }
}
