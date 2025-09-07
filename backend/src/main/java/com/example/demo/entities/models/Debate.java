package com.example.demo.entities.models;

import com.example.demo.entities.enums.DebateRound;
import com.example.demo.entities.enums.DebateStatus;
import com.example.demo.entities.enums.DebateWinner;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.Getter;
import lombok.Setter;

import java.util.*;

@Getter
@Setter
public class Debate {

    public Debate() {
        roundsData.put("opening", new ArrayList<>());
        roundsData.put("rebuttal", new ArrayList<>());
        roundsData.put("crosstalk", new ArrayList<>());
        roundsData.put("closing", new ArrayList<>());
        user_messages = new HashMap<>();
        votes = new ArrayList<>();
    }

    private long id;
    private String topic;

    @JsonManagedReference
    private List<Vote> votes;

    @JsonManagedReference
    private Map<String, List<Response>> roundsData;

    private int nextMessageId = 1;
    private boolean user_participated;
    private Map<String, String> user_messages;
    private List<AIDebater> debaters = new ArrayList<>();

    private DebateStatus status = DebateStatus.PENDING;
    private DebateWinner winner = DebateWinner.NONE;
    private DebateRound round = DebateRound.OPENING;
}
