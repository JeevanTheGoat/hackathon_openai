package com.example.demo.entities.models.dtos;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class LeaderboardResponse {

    private String name;

    private int funnyVotes;

    private int creativeVotes;

    private int wins;

    private int selectedCount;

}
