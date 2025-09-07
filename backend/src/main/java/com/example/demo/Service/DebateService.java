package com.example.demo.service;

import com.example.demo.entities.enums.DebateRound;
import com.example.demo.entities.models.*;
import com.example.demo.entities.models.dtos.DebateDTO;
import com.example.demo.entities.models.dtos.DebateUpdateDTO;
import com.example.demo.entities.models.dtos.DebateResponse;
import com.example.demo.exceptions.DebateNotFoundException;
import com.example.demo.holder.DebateHolder;
import com.example.demo.mapper.DebateMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class DebateService {

    private final AIFactory aiFactory;
    private final DebateHolder debateHolder;
    private final AiResponseService aiResponseService;

    private long nextId = 1;

    public List<Debate> getAllDebatesAsList(){
        return new ArrayList<>(debateHolder.getDebates().values());
    }

    public Debate createDebate(DebateDTO debateDTO) {
        Debate debate = new Debate();
        debate.setId(nextId++);
        debate.setTopic(debateDTO.getTopic());
        debate.setStatus(DebateStatus.ACTIVE);
        debate.setUser_participated(debateDTO.isUser_participated());

        List<AIDebater> debateAis = aiFactory.createDebateAIs(debateDTO.getSelected_ais());
        debate.setDebaters(debateAis);

        debateHolder.getDebates().put(debate.getId(), debate);

        // generate first round messages
        List<Response> responses = addMessage(debate.getId());
        debate.getRoundsData().put(debate.getRound().name().toLowerCase(), responses);

        return debate;
    }

    public Debate updateDebate(Long id, DebateUpdateDTO dto){
        Debate debate = getDebateById(id);

        if (debate.getUser_messages() == null) debate.setUser_messages(new HashMap<>());
        if (debate.getRoundsData() == null) debate.setRoundsData(new HashMap<>());

        // set current round
        String currentRound = dto.getCurrent_round();
        if(currentRound != null){
            for(DebateRound round : DebateRound.values()){
                if(currentRound.equalsIgnoreCase(round.name())){
                    debate.setRound(round);
                    break;
                }
            }
        }

        // generate AI responses only if not already present
        List<Response> currMessages = debate.getRoundsData()
                .computeIfAbsent(debate.getRound().name().toLowerCase(), k -> new ArrayList<>());
        if(dto.isGenerate_responses() && currMessages.isEmpty()){
            List<Response> responses = addMessage(id);
            debate.getRoundsData().put(debate.getRound().name().toLowerCase(), responses);
        }

        // save user messages
        if(debate.isUser_participated() && dto.getUser_messages() != null){
            debate.getUser_messages().put(
                    debate.getRound().name().toLowerCase(),
                    dto.getUser_messages().get(debate.getRound().name().toLowerCase())
            );
        }

        debateHolder.getDebates().put(id, debate);
        return debate;
    }

    public DebateResponse getDebateResponseById(Long id){
        Debate debate = debateHolder.getDebates().get(id);
        if(debate == null) throw new DebateNotFoundException("No debate with id " + id + " could be found.");
        DebateResponse dto = DebateMapper.debateToDTO(debate);
        dto.setCurrent_round(debate.getRound().name().toLowerCase());
        return dto;
    }

    public Debate get
