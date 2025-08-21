package com.example.demo.controllers;


import com.example.demo.entities.models.TopicDto;
import com.example.demo.service.TopicService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/topics")
@RequiredArgsConstructor
public class TopicController {

    private final TopicService topicService;

    @PostMapping
    public ResponseEntity<String> addTopic(@RequestBody TopicDto topicDto){
        return ResponseEntity.ok(topicService.addTopic(topicDto));
    }

}
