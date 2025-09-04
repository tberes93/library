package com.exam.library.model.interfaces;

import com.exam.library.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

public interface BorrowRepository extends JpaRepository<Borrowing, UUID> {
    @Query("select b from Borrowing b where b.bookId = :rid and b.end > :start and b.start < :end")
    List<Borrowing> findOverlaps(@Param("rid") UUID bookId,
                               @Param("start") LocalDateTime start,
                               @Param("end") LocalDateTime end);

    @Query("select b from Borrowing b where (:from is null or b.end > :from) and (:to is null or b.start < :to)")
    List<Borrowing> findInRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);
}
