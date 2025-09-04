package com.exam.library.services;

import com.exam.library.model.Borrowing;
import com.exam.library.model.interfaces.BorrowRepository;
import org.springframework.stereotype.Service;


@Service
public class BorrowService {
    private final BorrowRepository borrowRepository;
    public BorrowService(BorrowRepository borrowRepository) { this.borrowRepository = borrowRepository; }


    public Borrowing create(Borrowing b) {
        // TODO: a kezdeti dátum korábban van a végdátumnál ---> ezt én írtam most gyorsan
        if (b.getEnd() == null) {
            throw new IllegalArgumentException("Start date is mandatory.");
        }
        if (b.getEnd() != null && !b.getStart().isBefore(b.getEnd())) {
            throw new IllegalArgumentException("End date is before start date.");
        }
        if (!borrowRepository.findOverlaps(b.getBookId(), b.getStart(), b.getEnd()).isEmpty()) {
            throw new IllegalArgumentException("Overlapping renting");
        }
        b.setStatus("CONFIRMED");
        return borrowRepository.save(b);
    }


}
