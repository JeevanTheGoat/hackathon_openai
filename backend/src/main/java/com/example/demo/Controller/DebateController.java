package com.example.demo.Controller;

import com.example.demo.Entities.Debate;
import com.example.demo.Entities.DebateWinner;
import com.example.demo.Service.DebateService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/debates")
public class DebateController {

    private final DebateService debateService;

    @PostMapping
    public ResponseEntity<Debate> createDebate(@RequestParam String topic){
        return ResponseEntity.ok(debateService.createDebate(topic));
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
