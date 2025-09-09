package com.example.demo.websocket;

import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.dtos.DebateDTO;
import com.example.demo.entities.models.dtos.DebateResponse;
import com.example.demo.entities.models.dtos.DebateUpdateDTO;
import com.example.demo.entities.models.dtos.UserMessageDTO;
import com.example.demo.service.DebateService;
import com.example.demo.service.LeaderboardService;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;

import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class WebSocketService {

    private final DebateService debateService;
    private final LeaderboardService leaderboardService;

    private final ObjectMapper mapper = new ObjectMapper()
            .registerModule(new JavaTimeModule());

    private void safeSend(WebSocketSession session, Map<String, Object> message) {
        try {
            if (session != null && session.isOpen()) {
                session.sendMessage(new TextMessage(mapper.writeValueAsString(message)));
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public void sendDebateUpdate(WebSocketSession session, DebateUpdateDTO updateDTO) {
        System.out.println("Websocket call to sendDebateUpdate() recieved.");
        if (updateDTO == null) return;
        DebateResponse updated = debateService.updateDebate(updateDTO);
        System.out.println("Debate updated.");
        safeSend(session, Map.of(
                "type", "DEBATE_UPDATED",
                "payload", updated != null ? updated : Collections.emptyMap()
        ));
    }

    public void sendDebateDetails(WebSocketSession session, Long id) {
        if (id == null) return;
        DebateResponse response = null;
        try {
            response = debateService.getDebateResponseById(id);
        } catch (Exception e) {
            e.printStackTrace();
        }
        safeSend(session, Map.of(
                "type", "DEBATE_DATA",
                "payload", response != null ? response : Collections.emptyMap()
        ));
    }

    public void addUserMessage(WebSocketSession session, Long id,
                               String round, String messageText) {

        Map<String, String> userMessages = Collections.emptyMap();

        try {
            UserMessageDTO dto = new UserMessageDTO();
            dto.setRound(round);
            dto.setMessage(messageText);
            dto.setDebateId(id);

            userMessages = debateService.sendUserMessage(dto);

        } catch (Exception e) {
            e.printStackTrace();
        }

        Map<String, Object> payload = new HashMap<>();
        payload.put("type", "USER_MESSAGE_ADDED");
        payload.put("payload", userMessages != null ? userMessages : Collections.emptyMap());
        safeSend(session, payload);
    }

}
