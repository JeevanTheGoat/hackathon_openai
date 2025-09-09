package com.example.demo.entities.models.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UserMessageDTO {
    private String round;
    private String message;
    private long debateId;
}
