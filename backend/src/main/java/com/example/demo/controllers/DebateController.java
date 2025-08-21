package com.example.demo.controllers;

import com.example.demo.entities.models.Debate;
import com.example.demo.service.DebateService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/debates")
public class DebateController {

    private final DebateService debateService;

    @PostMapping("/{aiCount}")
    public ResponseEntity<Debate> createDebate(@PathVariable int aiCount){
        return ResponseEntity.ok(debateService.createDebate(aiCount));
    }


    @GetMapping("/{id}")
    public ResponseEntity<Debate> getDebateById(@PathVariable Long id){
        return ResponseEntity.ok(debateService.getDebateById(id));
    }


    @PostMapping("/resolveWinner/{id}")
    public ResponseEntity<Debate> resolveWinner(@PathVariable Long id, HttpSession session){
        return ResponseEntity.ok(debateService.handleDebateWinner(id, session));
    }

    @PutMapping("/startVoting/{id}")
    public ResponseEntity<String> startVoting(@PathVariable Long id){

        debateService.startVoting(id);
        return ResponseEntity.ok("Voting has begun.");

    }



}
