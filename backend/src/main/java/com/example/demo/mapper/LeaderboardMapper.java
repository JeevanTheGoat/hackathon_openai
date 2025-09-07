package com.example.demo.mapper;

import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.dtos.LeaderboardResponse;

public class LeaderboardMapper {

    public static LeaderboardResponse generateResponse(AIDebater aiDebater){

        LeaderboardResponse response = new LeaderboardResponse();
        response.setName(aiDebater.getStyle().name());
        response.setCreativeVotes(aiDebater.getCreativeVotes());
        response.setFunnyVotes(aiDebater.getFunnyVotes());
        response.setPlayed(aiDebater.getPlayed());
        response.setWins(aiDebater.getWins());

        return response;


    }

}
