package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.user.UserRequest;
import com.aisafetyaudit.dto.user.UserResponse;
import com.aisafetyaudit.entity.Factory;
import com.aisafetyaudit.entity.Role;
import com.aisafetyaudit.entity.User;
import com.aisafetyaudit.exception.ResourceNotFoundException;
import com.aisafetyaudit.repository.FactoryRepository;
import com.aisafetyaudit.repository.RoleRepository;
import com.aisafetyaudit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final FactoryRepository factoryRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse create(UserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered: " + request.email());
        }

        Role role = roleRepository.findByName(request.roleName())
                .orElseThrow(() -> new ResourceNotFoundException("Unknown role: " + request.roleName()));

        Factory factory = null;
        if (request.factoryId() != null) {
            factory = factoryRepository.findById(request.factoryId())
                    .orElseThrow(() -> new ResourceNotFoundException("Factory not found: " + request.factoryId()));
        }

        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .role(role)
                .factory(factory)
                .active(true)
                .build();

        return toResponse(userRepository.save(user));
    }

    public List<UserResponse> list() {
        return userRepository.findAll().stream().map(this::toResponse).toList();
    }

    public UserResponse getById(UUID id) {
        return toResponse(findEntity(id));
    }

    public UserResponse getByEmail(String email) {
        return toResponse(userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + email)));
    }

    @Transactional
    public UserResponse setActive(UUID id, boolean active) {
        User user = findEntity(id);
        user.setActive(active);
        return toResponse(user);
    }

    @Transactional
    public void delete(UUID id) {
        userRepository.delete(findEntity(id));
    }

    private User findEntity(UUID id) {
        return userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + id));
    }

    private UserResponse toResponse(User u) {
        return new UserResponse(
                u.getId(), u.getEmail(), u.getFullName(),
                u.getRole().getName(),
                u.getFactory() != null ? u.getFactory().getId() : null,
                u.isActive(), u.getCreatedAt()
        );
    }
}
