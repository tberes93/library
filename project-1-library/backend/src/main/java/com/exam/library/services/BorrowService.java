package com.exam.library.services;

import com.exam.library.model.Borrowing;
import com.exam.library.model.interfaces.BorrowRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;


@Service
public class BorrowService {
    private final BorrowRepository borrowRepository;

    public BorrowService(BorrowRepository borrowRepository) {
        this.borrowRepository = borrowRepository;
    }

    public Borrowing create(Borrowing b) {
        if (b.getEnd() == null || b.getStart() == null) {
            throw new IllegalArgumentException("Start and end date are mandatory.");
        }
        if (!b.getStart().isBefore(b.getEnd())) {
            throw new IllegalArgumentException("End date must be after start date.");
        }
        if (!borrowRepository.findOverlaps(b.getBookId(), b.getStart(), b.getEnd()).isEmpty()) {
            throw new IllegalArgumentException("Overlapping renting");
        }
        b.setStatus("Kikölcsönözve");
        return borrowRepository.save(b);
    }

    public List<Borrowing> getBorrowsByBook(UUID bookId) {
        return borrowRepository.findByBookId(bookId);
    }
}
