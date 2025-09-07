package com.example.demo.entities.models;


import com.example.demo.entities.enums.DebateRound;
import com.fasterxml.jackson.annotation.JsonBackReference;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;


@Getter
@Setter
public class Response {


    private long id;

    @JsonBackReference
    private Debate debate;

    private String sender;

    private String content;

    private DebateRound round;

    private LocalDateTime createdAt = LocalDateTime.now();
}
