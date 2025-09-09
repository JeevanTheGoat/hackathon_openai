package com.example.demo.controllers;

import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.dtos.DebateDTO;
import com.example.demo.entities.models.dtos.DebateResponse;
import com.example.demo.entities.models.dtos.DebateUpdateDTO;
import com.example.demo.service.DebateService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/debates")
public class DebateController {


    private final DebateService debateService;


    @PostMapping
    public ResponseEntity<Debate> createDebate(@RequestBody DebateDTO debateDTO){
        return ResponseEntity.ok(debateService.createDebate(debateDTO));
    }


    @GetMapping("/{id}")
    public ResponseEntity<DebateResponse> getDebateResponseById(@PathVariable Long id){
        return ResponseEntity.ok(debateService.getDebateResponseById(id));
    }

    @GetMapping
    public ResponseEntity<List<Debate>> getAllDebates(){
        return ResponseEntity.ok(debateService.getAllDebatesAsList());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDebate(@PathVariable Long id){
        debateService.deleteDebate(id);
        return ResponseEntity.noContent().build();
    }

    @PatchMapping("/{id}")
    public ResponseEntity<DebateResponse> updateDebate(@RequestBody DebateUpdateDTO data){

        return ResponseEntity.ok(debateService.updateDebate(data));

    }



}
