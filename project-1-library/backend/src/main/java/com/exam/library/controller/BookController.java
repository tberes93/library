package com.exam.library.controller;

import com.exam.library.model.Book;
import com.exam.library.model.interfaces.BookRepository;
import com.exam.library.model.interfaces.BorrowRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/books")
public class BookController {
    private final BookRepository repo;

    public BookController(BookRepository repo) { this.repo = repo; }


    @GetMapping public List<Book> list() { return repo.findAll(); }


    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public Book create(@RequestBody @Valid Book b) { return repo.save(b); }


    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public Book update(@PathVariable UUID id, @RequestBody Book b) {
        b.setId(id); return repo.save(b);
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        if (!repo.existsById(id)) return ResponseEntity.notFound().build();
        repo.deleteById(id);
        return ResponseEntity.noContent().build(); // 204
    }
}
