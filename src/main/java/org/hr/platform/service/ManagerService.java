package org.hr.platform.service;

import lombok.RequiredArgsConstructor;
import org.hr.platform.dto.UserDto;
import org.hr.platform.enums.Role;
import org.hr.platform.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ManagerService {

    private final UserService userService;
    private final UserRepository userRepository;

    public List<UserDto> viewEmployeesInOrg() {
        Long orgId = userService.getCurrentUser().getOrganization().getId();
        return userRepository.findByOrganizationIdAndRole(orgId, Role.EMPLOYEE)
                .stream()
                .map(UserDto::from)
                .toList();
    }
}
