package com.example.demo.exceptions;

public class MultipleVotesException extends RuntimeException {
    public MultipleVotesException(String message) {
        super(message);
    }
}
