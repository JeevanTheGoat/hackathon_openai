package com.example.demo.mapper;

import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.dtos.LeaderboardResponse;

public class LeaderboardMapper {

    public static LeaderboardResponse generateResponse(AIDebater aiDebater){

        LeaderboardResponse r = new LeaderboardResponse();
        r.setName(aiDebater.getStyle().name());
        r.setCreativeVotes(aiDebater.getCreativeVotes());
        r.setFunnyVotes(aiDebater.getFunnyVotes());
        r.setSelectedCount(aiDebater.getSelectedCount());
        r.setWins(aiDebater.getWins());

        return r;


    }

}
