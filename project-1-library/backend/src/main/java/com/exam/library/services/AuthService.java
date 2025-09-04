package com.exam.library.services;

import com.exam.library.model.User;
import com.exam.library.model.interfaces.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    private final UserRepository users;
    private final PasswordEncoder encoder;


    public AuthService(UserRepository users, PasswordEncoder encoder) { this.users = users; this.encoder = encoder; }


    public User register(String email, String rawPassword) {
        if (users.findByEmail(email).isPresent()) throw new IllegalArgumentException("Email already used");
        User u = new User();
        u.setEmail(email);
        u.setPasswordHash(encoder.encode(rawPassword));
        u.setRole("USER");
        return users.save(u);
    }


    public User authenticate(String email, String rawPassword) {
        User u = users.findByEmail(email).orElseThrow(() -> new IllegalArgumentException("Bad credentials"));
        if (!encoder.matches(rawPassword, u.getPasswordHash())) throw new IllegalArgumentException("Bad credentials");
        return u;
    }
}
