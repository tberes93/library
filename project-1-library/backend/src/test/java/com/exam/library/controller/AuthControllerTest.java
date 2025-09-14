package com.exam.library.controller;

import com.exam.library.model.User;
import com.exam.library.model.interfaces.UserRepository;
import com.exam.library.services.AuthService;
import com.exam.library.services.JwtService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(AuthController.class)
@AutoConfigureMockMvc(addFilters = false)
public class AuthControllerTest {


    @Autowired
    MockMvc mockMvc;
    @MockBean
    AuthService authService;
    @MockBean
    JwtService jwtService;


    @MockBean
    private UserRepository userRepository;

    @Test
    void testRegisterNewUser() throws Exception {
        String body = """
                {
                  "email": "newuser@example.com",
                  "password": "User123!"
                }
                """;
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isCreated())
                .andExpect(content().string(""));
    }

    @Test
    void testLoginWithValidCredentials() throws Exception {

        User u = new User();
        u.setEmail("user@example.com");
        u.setPasswordHash("hash");
        u.setRole("USER");

        String body = """
                {
                  "email": "user@example.com",
                  "password": "pw"
                }
                """;

        Mockito.when(authService.authenticate("user@example.com", "pw")).thenReturn(u);
        Mockito.when(jwtService.generate(u)).thenReturn("JWT-TOKEN");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body)
                        .with(org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf()))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$.accessToken").value("JWT-TOKEN"));
    }

}
