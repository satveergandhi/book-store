package com.pts.books.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Books {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookId;

    @Column(nullable = false)
    private String bookName;

    @Column(nullable = false)
    private String author;

    public Books() {}

    // Convenience constructor
    public Books(String bookName, String author) {
        this.bookName = bookName;
        this.author = author;
    }

    // Getters & Setters
    public Long getBookId() { return bookId; }
    public void setBookId(Long bookId) { this.bookId = bookId; }

    public String getBookName() { return bookName; }
    public void setBookName(String bookName) { this.bookName = bookName; }

    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
}