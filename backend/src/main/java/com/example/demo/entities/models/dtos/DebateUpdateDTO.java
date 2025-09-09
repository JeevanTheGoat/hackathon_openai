package com.example.demo.entities.models.dtos;

import lombok.Getter;
import lombok.Setter;

import java.util.Map;

@Getter
@Setter
public class DebateUpdateDTO {

    private String current_round;

    private boolean generate_responses;

    private Map<String, String> user_messages;

    private long debateId;

}