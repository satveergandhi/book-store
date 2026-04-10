package com.pts.books.repo;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.pts.books.model.Books;

public interface BookRepo extends JpaRepository<Books, Long>  {
	public List<Books> findByBookNameAndAuthor(String bookName, String author);
}
