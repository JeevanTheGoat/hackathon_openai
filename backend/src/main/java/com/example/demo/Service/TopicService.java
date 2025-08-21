package com.example.demo.service;


import com.example.demo.entities.models.TopicDto;
import com.example.demo.entities.models.TopicQueue;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TopicService {

    private final TopicQueue topicQueue;

    public String addTopic(TopicDto topicDto){
        String topic = topicDto.getTopic();
        topicQueue.addTopic(topic);
        return topic;
    }

}
