package com.example.demo.Exceptions;

public class MultipleVotesException extends RuntimeException {
    public MultipleVotesException(String message) {
        super(message);
    }
}
