package com.exam.library.controller;

import com.exam.library.filter.JwtAuthFilter;
import com.exam.library.model.Borrowing;
import com.exam.library.model.User;
import com.exam.library.model.interfaces.BorrowRepository;
import com.exam.library.model.interfaces.UserRepository;
import com.exam.library.services.BorrowService;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Optional;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BorrowingController.class)
@AutoConfigureMockMvc(addFilters = false)
public class BorrowingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    JwtAuthFilter jwtAuthFilter;
    @MockBean
    UserRepository users;

    @MockBean
    BorrowRepository repo;
    @MockBean
    BorrowService service;

    private String email = "user@example.com";



    @Test
    void testCreateBorrowing() throws Exception {
        Mockito.when(users.findByEmail(this.email)).thenReturn(Optional.of(this.getUser()));
        Mockito.when(service.create(any(Borrowing.class))).thenReturn(this.getSavedBorrowing());
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getPrincipal()).thenReturn(this.email);

        mockMvc.perform(post("/api/borrows").principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.getBody()))
                .andExpect(status().isOk());
    }

    @Test
    void testBorrowOverlapShouldFail() throws Exception {
        Mockito.when(users.findByEmail(this.email)).thenReturn(Optional.of(this.getUser()));
        Mockito.when(service.create(any(Borrowing.class))).thenThrow(new IllegalArgumentException("Overlapping renting"));
        Authentication auth = Mockito.mock(Authentication.class);
        Mockito.when(auth.getPrincipal()).thenReturn(this.email);

        mockMvc.perform(post("/api/borrows").principal(auth)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(this.getBody()))
                .andExpect(status().isConflict()); // 409-es hibakód
    }



    private String getBody() {
        return  """
                {
                  "bookId": "11111111-1111-1111-1111-111111111111",
                  "start": "2025-09-01T10:00:00",
                  "end": "2025-09-10T18:00:00"
                }
                """;
    }

    private User getUser() {
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setEmail("user@example.com");
        user.setPasswordHash("hash");
        user.setRole("USER");
        return user;
    }

    private Borrowing getSavedBorrowing() {
        Borrowing saved = new Borrowing();
        saved.setId(UUID.randomUUID());
        return saved;
    }
}
