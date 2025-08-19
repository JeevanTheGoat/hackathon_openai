package com.example.demo.Controller;

import com.example.demo.Entities.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class WebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public void pushMessage(Long debateId, Message message) {
        // Broadcast to all clients subscribed to this debate
        messagingTemplate.convertAndSend("/topic/debate/" + debateId, message);
    }

}
