package com.example.demo.websocket;

import com.example.demo.entities.models.dtos.DebateUpdateDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.util.Map;

@Component
@RequiredArgsConstructor
public class DebateWebSocketHandler extends TextWebSocketHandler {

    private final WebSocketService webSocketService;
    private final ObjectMapper mapper = new ObjectMapper().registerModule(new JavaTimeModule());

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        System.out.println("Connected");

        if (message == null || message.getPayload() == null || message.getPayload().isBlank()) return;



        Map<String, Object> json = mapper.readValue(message.getPayload(), Map.class);
        String type = (String) json.get("type");
        Map<String, Object> payload = (Map<String, Object>) json.get("payload");

        switch (type) {
            case "GET_DEBATE_DATA":
                if (payload != null && payload.get("debateId") != null) {
                    Long debateId = Long.valueOf(payload.get("debateId").toString());
                    webSocketService.sendDebateDetails(session, debateId);
                }
                break;

            case "UPDATE_DEBATE":
                if (payload != null && payload.get("debateId") != null && payload.get("data") != null) {
                    Long debateId = Long.valueOf(payload.get("debateId").toString());
                    Map<String, Object> updateMap = (Map<String, Object>) payload.get("data");
                    DebateUpdateDTO updateDTO = mapper.convertValue(updateMap, DebateUpdateDTO.class);
                    updateDTO.setDebateId(debateId); // ensure the ID is set
                    webSocketService.sendDebateUpdate(session, updateDTO);
                }
                break;

            case "ADD_USER_MESSAGE":
                System.out.println("User message requested.");
                if (payload != null && payload.get("debateId") != null) {
                    Long debateId = Long.valueOf(payload.get("debateId").toString());
                    String round = payload.get("round").toString();
                    String messageText = payload.get("message").toString();
                    webSocketService.addUserMessage(session, debateId, round, messageText);
                }
                break;

            default:
                System.out.println("Unknown type: " + type);
        }
    }
}
