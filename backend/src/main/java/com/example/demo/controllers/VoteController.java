package com.example.demo.controllers;


import com.example.demo.entities.models.Vote;
import com.example.demo.service.VoteService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/{id}")
    public ResponseEntity<Vote> vote(@RequestBody Vote vote, @PathVariable Long id){
        return ResponseEntity.ok(voteService.recordVote(vote, id));
    }

}
