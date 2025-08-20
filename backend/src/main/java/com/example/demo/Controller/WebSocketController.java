package com.example.demo.controller;

import com.example.demo.entities.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void pushMessage(Long debateId, Message message) {

        messagingTemplate.convertAndSend("/topic/debate/" + debateId, message);
    }

}
