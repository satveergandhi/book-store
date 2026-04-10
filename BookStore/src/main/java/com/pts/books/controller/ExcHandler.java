package com.pts.books.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ExcHandler {
	
	@ExceptionHandler(MissingServletRequestParameterException.class)
	public ResponseEntity<?> handleMissingParam(MissingServletRequestParameterException e){
		return ResponseEntity.badRequest().body("missing req param : "+e.getMessage());
		
	}

	@ExceptionHandler(Exception.class)
	public ResponseEntity<?> handleException(Exception e){
		return ResponseEntity.internalServerError().body(e.getMessage());
		
	}
}
