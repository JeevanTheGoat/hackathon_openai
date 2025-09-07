package com.example.demo.service;

import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.dtos.LeaderboardResponse;
import com.example.demo.mapper.LeaderboardMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class LeaderboardService {

    private final AIFactory aiFactory;

    public List<LeaderboardResponse> getLeaderboard(){

        List<AIDebater> masterAis =  aiFactory.getMasterAIs();
        List<LeaderboardResponse> responses = new ArrayList<>();

        for(AIDebater masterAi: masterAis){
            responses.add(LeaderboardMapper.generateResponse(masterAi));
        }

        return responses;


    }

}
