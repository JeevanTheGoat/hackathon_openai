package com.example.demo.entities;


import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class Message {


    private long id;

    @JsonBackReference
    private Debate debate;

    private String sender;

    private String content;

    private LocalDateTime createdAt = LocalDateTime.now();
}
