package com.example.demo.service;

import com.example.demo.entities.enums.DebateRound;
import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Response;
import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.dtos.DebateDTO;
import com.example.demo.entities.models.dtos.DebateUpdateDTO;
import com.example.demo.entities.models.dtos.DebateResponse;
import com.example.demo.exceptions.DebateNotFoundException;
import com.example.demo.holder.DebateHolder;
import com.example.demo.mapper.DebateMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class DebateService {

    private final AIFactory aiFactory;
    private final DebateHolder debateHolder;
    private final AiResponseService aiResponseService;
    private final SimpMessagingTemplate messagingTemplate; // For WebSocket push

    private long nextId = 1;

    // Get all debates as a list
    public List<Debate> getAllDebatesAsList() {
        return new ArrayList<>(debateHolder.getDebates().values());
    }

    private Map<Long, Debate> getDebates() {
        return debateHolder.getDebates();
    }

    public void deleteDebate(Long id) {
        getDebateById(id); // Throws exception if not found
        debateHolder.getDebates().remove(id);
    }

    public Debate createDebate(DebateDTO debateDTO) {
        Debate debate = new Debate();
        debate.setId(nextId++);
        debate.setTopic(debateDTO.getTopic());
        debate.setStatus(com.example.demo.entities.enums.DebateStatus.ACTIVE);
        debate.setUser_participated(debateDTO.isUser_participated());

        // Create AI debaters
        List<AIDebater> debateAis = aiFactory.createDebateAIs(debateDTO.getSelected_ais());
        debate.setDebaters(debateAis);

        // Save debate
        debateHolder.getDebates().put(debate.getId(), debate);

        // Generate first round messages
        List<Response> responses = addMessage(debate.getId());
        debate.getRoundsData().put(debate.getRound().name().toLowerCase(), responses);

        return debate;
    }

    // Update debate
    public Debate updateDebate(Long id, DebateUpdateDTO dto) {
        Debate debate = getDebateById(id);

        if (debate.getUser_messages() == null) debate.setUser_messages(new HashMap<>());
        if (debate.getRoundsData() == null) debate.setRoundsData(new HashMap<>());

        // Update current round if provided
        if (dto.getCurrent_round() != null) {
            for (DebateRound round : DebateRound.values()) {
                if (dto.getCurrent_round().equalsIgnoreCase(round.name())) {
                    debate.setRound(round);
                    break;
                }
            }
        }

        // Generate AI messages if requested and not already present
        if (dto.isGenerate_responses()) {
            String roundKey = debate.getRound().name().toLowerCase();
            List<Response> roundMessages = debate.getRoundsData()
                    .computeIfAbsent(roundKey, k -> new ArrayList<>());

            if (roundMessages.isEmpty()) {
                List<Response> responses = addMessage(id);
                debate.getRoundsData().put(roundKey, responses);
            }
        }

        // Save user messages if provided
        if (debate.isUser_participated() && dto.getUser_messages() != null) {
            String roundKey = debate.getRound().name().toLowerCase();
            debate.getUser_messages().put(roundKey, dto.getUser_messages().get(roundKey));
        }

        debateHolder.getDebates().put(id, debate);
        return debate;
    }

    // Get debate response DTO
    public DebateResponse getDebateResponseById(Long id) {
        Debate debate = getDebateById(id);
        return DebateMapper.debateToDTO(debate);
    }

    public Debate getDebateById(Long id) {
        Debate debate = debateHolder.getDebates().get(id);
        if (debate == null) throw new DebateNotFoundException("No debate with id " + id + " could be found.");
        return debate;
    }

    // Synchronized message generation to prevent duplicate AI messages
    public synchronized List<Response> addMessage(Long id) {
        Debate debate = getDebateById(id);
        DebateRound debateRound = debate.getRound();

        // Flatten all previous messages for context
        List<Response> history = debate.getRoundsData().values().stream()
                .flatMap(List::stream)
                .collect(Collectors.toList());

        // Current round messages, if not already present
        String roundKey = debateRound.name().toLowerCase();
        List<Response> currMessages = debate.getRoundsData()
                .computeIfAbsent(roundKey, k -> new ArrayList<>());

        // Prevent duplicate AI generation for the same turn
        if (!currMessages.isEmpty()) return currMessages;

        List<AIDebater> debateAis = debate.getDebaters();
        String topic = debate.getTopic();

        // Generate AI responses
        List<String> responses = aiResponseService.generateMultipleTexts(topic, history, debateAis, debateRound);

        for (int i = 0; i < debateAis.size(); i++) {
            AIDebater debater = debateAis.get(i);
            Response message = new Response();
            message.setCreatedAt(LocalDateTime.now());
            message.setDebate(debate);
            message.setRound(debateRound);
            message.setContent(responses.get(i));
            message.setSender(debater.getStyle().name());
            message.setId(debate.getNextMessageId());
            debate.setNextMessageId(debate.getNextMessageId() + 1);

            currMessages.add(message);

            // WebSocket push for frontend update
            messagingTemplate.convertAndSend("/topic/debate/" + debate.getId(), message);
        }

        return currMessages;
    }
}
