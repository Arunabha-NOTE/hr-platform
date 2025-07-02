package org.hr.platform.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "super_admins")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SuperAdmin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    @Column(nullable = false)
    private String firstName;

    @Column(nullable = false)
    private String lastName;

    @Column(nullable = false)
    @Builder.Default
    private boolean firstLogin = true;

    @Column(nullable = false)
    @Builder.Default
    private boolean active = true;
}
