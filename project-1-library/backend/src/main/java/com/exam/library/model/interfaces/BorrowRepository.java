package com.exam.library.model.interfaces;

import com.exam.library.model.Borrowing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface BorrowRepository extends JpaRepository<Borrowing, UUID> {

    @Query("SELECT b FROM Borrowing b WHERE b.bookId = :bookId ORDER BY b.start ASC")
    List<Borrowing> findByBookId(@Param("bookId") UUID bookId);

    @Query("SELECT b FROM Borrowing b " +
            "WHERE b.bookId = :bookId " +
            "AND b.start < :end AND b.end > :start")
    List<Borrowing> findOverlaps(@Param("bookId") UUID bookId,
                                 @Param("start") LocalDateTime start,
                                 @Param("end") LocalDateTime end);

    @Query("select b from Borrowing b where (:from is null or b.end > :from) and (:to is null or b.start < :to)")
    List<Borrowing> findInRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to);


}

