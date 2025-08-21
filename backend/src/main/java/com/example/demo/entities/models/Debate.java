package com.example.demo.entities.models;


import com.example.demo.entities.enums.DebateStatus;
import com.example.demo.entities.enums.DebateTurn;
import com.example.demo.entities.enums.DebateWinner;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class Debate {


    private long id;

    private String topic;

    @JsonManagedReference
    private List<Vote> votes = new ArrayList<>();

    @JsonManagedReference
    private List<Message> messages = new ArrayList<>();

    private int nextMessageId = 1;

    private Map<DebateTurn, AIDebater> debaters = new HashMap<>();

    private DebateStatus status = DebateStatus.PENDING;
    private DebateWinner winner = DebateWinner.NONE;
    private DebateTurn turn = DebateTurn.AI1;


}
