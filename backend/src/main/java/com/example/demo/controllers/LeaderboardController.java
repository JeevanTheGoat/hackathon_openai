package com.example.demo.controllers;

import com.example.demo.entities.models.dtos.LeaderboardResponse;
import com.example.demo.service.LeaderboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    private final LeaderboardService leaderboardService;

    @GetMapping
    public ResponseEntity<List<LeaderboardResponse>> getLeaderboard(){
        return ResponseEntity.ok(leaderboardService.getLeaderboard());
    }

}
