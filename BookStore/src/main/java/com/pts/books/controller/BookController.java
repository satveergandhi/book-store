package com.pts.books.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.pts.books.model.Books;
import com.pts.books.model.PageResponse;
import com.pts.books.repo.BookRepo;

import io.github.resilience4j.circuitbreaker.annotation.CircuitBreaker;
import io.github.resilience4j.retry.annotation.Retry;
import jakarta.persistence.EntityNotFoundException;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/books")
public class BookController {
	
	@Autowired
	BookRepo repo;
	
	@PostMapping("/post")
	public ResponseEntity<?> bookPublisher(@RequestBody Books books) {
		System.out.println("Books!!");
		try {
			return ResponseEntity.ok(repo.save(books));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@Retry(name = "find retry", fallbackMethod = "fallbackForNoBooks")
	@CircuitBreaker(name = "book finder", fallbackMethod = "fallbackForNoBooks")
	@GetMapping("/findABook")
	public ResponseEntity<?> bookSearch(@RequestParam("bookName") String bookName, @RequestParam("author") String author) {
		System.out.println("Books!!");
		try {
			return ResponseEntity.ok(repo.findByBookNameAndAuthor(bookName, author));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PutMapping("/updABook")
	public ResponseEntity<?> updBook(@RequestParam Long bookId, @RequestParam String bookName, @RequestParam(required = false) String author) {
		System.out.println("Books!!");
		try {
			Books existingBook = repo.findById(bookId)
			        .orElseThrow(() -> new RuntimeException("Book not found"));
			if(author != null)
				existingBook.setAuthor(author);
			return ResponseEntity.ok(repo.save(existingBook));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@PatchMapping("/updABookAuthor")
	public ResponseEntity<?> updBookAut(@RequestParam Long bookId, 
			@RequestParam(required = false) String bookName, @RequestParam(required = false) String author) {
		System.out.println("Books!!");
		try {
			Books existingBook = repo.findById(bookId).orElseThrow(()-> new EntityNotFoundException());
			if(bookName != null)
				existingBook.setBookName(bookName);
			if(author != null)
				existingBook.setAuthor(author);
			return ResponseEntity.ok(repo.save(existingBook));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	@DeleteMapping("/books/{id}")
	public ResponseEntity<?> deleteBook(@PathVariable("id") Long id){
		  if (!repo.existsById(id)) {
		        return ResponseEntity.status(404).body("Book not found");
		    }
		    repo.deleteById(id);
		    return ResponseEntity.ok("Book deleted successfully");
	}
	
	@DeleteMapping("/books")
	public ResponseEntity<?> deleteBook(@RequestBody List<Long> id) {
		List<Books> bks = repo.findAllById(id);
		List<Long> ids = bks.stream().map(Books::getBookId).toList();
		List<Long> missings = id.stream().filter(inn -> !ids.contains(inn)).toList();
		if (!missings.isEmpty())
			return ResponseEntity.status(404).body("Missing IDs : " + missings);
		repo.deleteAllById(id);
		return ResponseEntity.ok("Book deleted successfully");
	}
	
	@GetMapping("/books")
	public ResponseEntity<?> allBooks(@RequestParam(name="page", defaultValue = "0") int page,
	        @RequestParam(name="size", defaultValue = "5") int size) {
		try {
			Page<Books> bks = repo.findAll(PageRequest.of(page, size));
			return ResponseEntity.ok(new PageResponse<>(bks));
		} catch (Exception e) {
			return ResponseEntity.badRequest().body(e.getMessage());
		}
	}
	
	public ResponseEntity<?> fallbackForNoBooks(
	        String bookName,
	        String author,
	        Throwable ex) {
	    return ResponseEntity.ok(
	        List.of(new Books("DEFAULT", "SYSTEM"))
	    );
	}
	
}
