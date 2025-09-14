package com.exam.library.model;


import com.exam.library.model.interfaces.BorrowRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest(properties = "spring.flyway.enabled=false")
@ActiveProfiles("test")
class BorrowingRepositoryTest {


    @Autowired
    BorrowRepository borrowRepository;


    @Test
    void findOverlaps_returnsConflictsOnly() {
        UUID uuid = UUID.randomUUID();
        Borrowing b1 = this.getBorrowing(uuid, LocalDateTime.of(2030, 1, 1, 10, 0), LocalDateTime.of(2030, 1, 1, 12, 0));
        borrowRepository.save(b1);

        // átfed (kezdet benne)
        Borrowing b2 = this.getBorrowing(uuid, LocalDateTime.of(2030, 1, 1, 11, 0), LocalDateTime.of(2030, 1, 1, 13, 0));
        borrowRepository.save(b2);

        // másik könyv nem ütközik
        Borrowing otherBorrowing = this.getBorrowing(UUID.randomUUID(), LocalDateTime.of(2030, 1, 1, 11, 0), LocalDateTime.of(2030, 1, 1, 13, 0));
        borrowRepository.save(otherBorrowing);

        List<Borrowing> conflicts = borrowRepository.findOverlaps(
                uuid,
                LocalDateTime.of(2030, 1, 1, 9, 30),
                LocalDateTime.of(2030, 1, 1, 10, 30));

        assertThat(conflicts).hasSize(1);
    }

    @Test
    void findOverlaps_noConflictBecauseOfCancelledState() {
        UUID uuid = UUID.randomUUID();
        Borrowing bCancelled = this.getBorrowing(uuid, LocalDateTime.of(2030, 1, 1, 10, 0), LocalDateTime.of(2030, 1, 1, 12, 0));
        bCancelled.setStatus("CANCELLED");
        borrowRepository.save(bCancelled);

        // átfedne (kezdet benne), de ez confirmed a másik pedig cancelled
        Borrowing b2 = this.getBorrowing(uuid, LocalDateTime.of(2030, 1, 1, 11, 0), LocalDateTime.of(2030, 1, 1, 13, 0));
        borrowRepository.save(b2);

        List<Borrowing> conflicts = borrowRepository.findOverlaps(
                uuid,
                LocalDateTime.of(2030, 1, 1, 9, 30),
                LocalDateTime.of(2030, 1, 1, 10, 30));

        assertThat(conflicts).isEmpty();
    }


    @Test
    void findInRange_respectsNullBounds() {
        UUID uuid = UUID.randomUUID();
        Borrowing b = this.getBorrowing(uuid, LocalDateTime.of(2030, 1, 1, 10, 0), LocalDateTime.of(2030, 1, 2, 10, 0));
        borrowRepository.save(b);

        assertThat(borrowRepository.findInRange(null, null)).hasSize(1);
        assertThat(borrowRepository.findInRange(LocalDateTime.of(2031, 1, 1, 0, 0), null)).isEmpty();
        assertThat(borrowRepository.findInRange(null, LocalDateTime.of(2029, 12, 31, 0, 0))).isEmpty();
    }


    private Borrowing getBorrowing(UUID uuid, LocalDateTime s1, LocalDateTime e1) {
        Borrowing b1 = new Borrowing();
        b1.setBookId(uuid);
        b1.setStart(s1);
        b1.setEnd(e1);
        b1.setStatus("Kikölcsönözve");
        b1.setUserId(UUID.randomUUID());
        return b1;
    }
}
