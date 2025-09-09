package com.example.demo.Service;

import com.example.demo.entities.enums.DebateRound;
import com.example.demo.entities.enums.DebateStatus;
import com.example.demo.entities.models.*;
import com.example.demo.entities.models.dtos.DebateDTO;
import com.example.demo.entities.models.dtos.DebateResponse;
import com.example.demo.entities.models.dtos.DebateUpdateDTO;
import com.example.demo.entities.models.dtos.UserMessageDTO;
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


    public List<Debate> getAllDebatesAsList(){
        return new ArrayList<>(debateHolder.getDebates().values());
    }


    private Map<Long, Debate> getDebates(){
        return debateHolder.getDebates();
    }


    private long nextId = 1;


    public void deleteDebate(Long id){
        Debate debate = getDebateById(id);
        debateHolder.getDebates().remove(id);
    }


    public Debate createDebate(DebateDTO debateDTO) {


        String topic = debateDTO.getTopic();
        Debate debate = new Debate();

        debate.setId(nextId++);
        debate.setTopic(topic);
        debate.setStatus(DebateStatus.ACTIVE);
        debate.setUser_participated(debateDTO.isUser_participated());

        List<String> aiNames = debateDTO.getSelected_ais();

        List<AIDebater> debateAis = aiFactory.createDebateAIs(aiNames);
        debate.setDebaters(debateAis);

        updateDebate(debate.getId(), debate);
        List<Response> responses =  addMessage(debate.getId());
        debate.getRoundsData().put(debate.getRound().name().toLowerCase(), responses);

        return debate;
    }


    public DebateResponse updateDebate(DebateUpdateDTO dto){

        Long id = dto.getDebateId();
        Debate debate = getDebateById(id);

        if (debate.getUser_messages() == null) {
            debate.setUser_messages(new HashMap<>());
        }
        if (debate.getRoundsData() == null) {
            debate.setRoundsData(new HashMap<>());
        }

        String currentRound = dto.getCurrent_round();

        if (currentRound != null) {
            for (DebateRound round : DebateRound.values()) {
                if (currentRound.equalsIgnoreCase(round.name())) {
                    debate.setRound(round);
                    break;
                }
            }
        }

        if(dto.isGenerate_responses() && debate.getRoundsData().get(currentRound).isEmpty()){
            List<Response> responses = addMessage(id);
            debate.getRoundsData().put(debate.getRound().name().toLowerCase(), responses);
        }

        if(debate.isUser_participated() && dto.getUser_messages() != null){
            debate.getUser_messages().put(debate.getRound().name().toLowerCase(), dto.getUser_messages().get(debate.getRound().name().toLowerCase()));
        }

        updateDebate(id, debate);

        return DebateMapper.debateToDTO(debate);
    }


    public DebateResponse getDebateResponseById(Long id) {
        Debate debate = debateHolder.getDebates().get(id);
        if (debate == null) {
            throw new DebateNotFoundException("No debate with id " + id + " could be found.");
        }
        return DebateMapper.debateToDTO(debate);
    }

    public void updateDebate(Long id, Debate debate){
        debateHolder.getDebates().put(id, debate);
    }

    public Debate getDebateById(Long id) {
        Debate debate = debateHolder.getDebates().get(id);
        if (debate == null) {
            throw new DebateNotFoundException("No debate with id " + id + " could be found.");
        }
        return debate;
    }

    public Map<String, String> sendUserMessage(UserMessageDTO msg){
        Debate debate = getDebateById(msg.getDebateId());
        debate.getUser_messages().put(msg.getRound(), msg.getMessage());
        return debate.getUser_messages();
    }


    public List<Response> addMessage(Long id) {

        Debate debate = getDebateById(id);

        DebateRound debateRound = debate.getRound();

        List<Response> history = new ArrayList<>(debate.getRoundsData().values().stream()
                .flatMap(List::stream)
                .toList());

        List<Response> currMessages = debate.getRoundsData()
                .computeIfAbsent(debateRound.name().toLowerCase(), k -> new ArrayList<>());
        String topic = debate.getTopic();

        List<AIDebater> debateAis = debate.getDebaters();

        List<String> responses = aiResponseService.generateMultipleTexts(topic, history, debateAis, debateRound);

        for (int i = 0; i < debateAis.size(); i++) {
            AIDebater debater = debateAis.get(i);
            String response = responses.get(i);
            Response message = new Response();
            message.setCreatedAt(LocalDateTime.now());
            message.setDebate(debate);
            message.setRound(debateRound);
            message.setContent(response);
            message.setSender(debater.getStyle().name());
            message.setId(debate.getNextMessageId());
            debate.setNextMessageId(debate.getNextMessageId() + 1);
            currMessages.add(message);
        }
        return currMessages;
    }

}
