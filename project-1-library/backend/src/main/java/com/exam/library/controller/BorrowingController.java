package com.exam.library.controller;

import com.exam.library.model.Borrowing;
import com.exam.library.model.interfaces.BorrowRepository;
import com.exam.library.model.interfaces.UserRepository;
import com.exam.library.services.BorrowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.exam.library.model.User;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/borrows")
public class BorrowingController {
    private final BorrowService service;
    private final UserRepository users;

    @Autowired
    private BorrowRepository borrowRepository;

    public BorrowingController(BorrowService service, UserRepository users) { this.service = service; this.users = users; }

    @GetMapping
    public List<Borrowing> list(@RequestParam(required=false) @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
                                @RequestParam(required=false) @DateTimeFormat(iso= DateTimeFormat.ISO.DATE_TIME) LocalDateTime to){
        return borrowRepository.findInRange(from, to);
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody Borrowing b, Authentication auth) {
        String email = (String)auth.getPrincipal();
        UUID userId = users.findByEmail(email).map(User::getId).orElseThrow();
        b.setUserId(userId);
        try { return ResponseEntity.ok(service.create(b)); }
        catch (IllegalArgumentException ex) { return ResponseEntity.status(409).body(ex.getMessage()); }
    }


}
