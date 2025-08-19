package com.example.demo.Entities;

import jakarta.persistence.*;
import lombok.Data;

import java.util.List;

@Entity
@Data
public class Debate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @OneToMany(mappedBy = "debate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Vote> votes;

    @Enumerated(EnumType.STRING)
    private DebateStatus status = DebateStatus.PENDING;

    @Enumerated(EnumType.STRING)
    private DebateWinner winner = DebateWinner.NONE;

    @Enumerated(EnumType.STRING)
    private DebateTurn turn = DebateTurn.AI1;

    @OneToMany(mappedBy = "debate", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Message> messages;

    private int voteCount;

    private String topic;


}
