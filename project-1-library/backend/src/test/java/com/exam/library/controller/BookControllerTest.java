package com.exam.library.controller;

import com.exam.library.filter.JwtAuthFilter;
import com.exam.library.model.interfaces.BookRepository;
import com.exam.library.model.interfaces.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(BookController.class)
@AutoConfigureMockMvc(addFilters = false)
public class BookControllerTest {
    @Autowired
    private MockMvc mockMvc;


    @MockBean
    JwtAuthFilter jwtAuthFilter;
    @MockBean
    UserRepository userRepoForSecurity;
    @MockBean
    BookRepository repo;

    @Test
    void testListBooks() throws Exception {
        mockMvc.perform(get("/api/books"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void testAddBookAsAdmin() throws Exception {
        String body = """
                {
                  "title": "Pál utcai fiúk",
                  "writer": "Molnár Ferenc",
                  "type": "Regény",
                  "description": "Klasszikus ifjúsági irodalom"
                }
                """;
        mockMvc.perform(post("/api/books")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(body))
                .andExpect(status().isOk());
    }

}
