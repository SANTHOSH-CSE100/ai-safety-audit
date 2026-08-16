package com.aisafetyaudit.security;

import com.aisafetyaudit.entity.User;
import com.aisafetyaudit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserRepository userRepository;

    /**
     * Required: this is called directly from JwtAuthFilter (a plain servlet
     * filter, not a @Transactional bean) on every authenticated request.
     * Without an open Hibernate session here, `user.getRole()` — LAZY —
     * throws LazyInitializationException as soon as `.getName()` touches
     * the uninitialized proxy below, which Spring Security's filter chain
     * turns into a bare 403 for every single protected endpoint. Keeping
     * the session open for this method's duration is what makes the lazy
     * load work.
     */
    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("No user found with email: " + email));

        List<GrantedAuthority> authorities =
                List.of(new SimpleGrantedAuthority("ROLE_" + user.getRole().getName()));

        return org.springframework.security.core.userdetails.User
                .withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .authorities(authorities)
                .disabled(!user.isActive())
                .build();
    }
}
