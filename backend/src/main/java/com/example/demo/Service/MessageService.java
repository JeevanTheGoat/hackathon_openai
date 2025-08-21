package com.example.demo.service;

import com.example.demo.controllers.WebSocketController;
import com.example.demo.entities.enums.DebateTurn;
import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.Message;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {




    private final DebateService debateService;
    private final WebSocketController webSocketController;
    private final AiResponseService aiResponseService;


    public List<Message> getMessagesByDebateId(Long id){

        return debateService.getDebate(id).getMessages();


    }

    public Message addMessage(Long id){

        Debate debate = debateService.getDebate(id);
        List<Message> messages = debate.getMessages();

        String topic = debate.getTopic();
        DebateTurn turn = debate.getTurn();
        AIDebater aiDebater = debate.getDebaters().get(turn);


        String response = aiResponseService.generateText(topic, messages, aiDebater);


        Message message = new Message();
        message.setCreatedAt(LocalDateTime.now());
        message.setDebate(debate);
        message.setContent(response);
        message.setSender(turn.name());
        message.setId(debate.getNextMessageId());
        debate.setNextMessageId(debate.getNextMessageId()+1);


        List<DebateTurn> turns = new ArrayList<>(debate.getDebaters().keySet());

        int i = turns.indexOf(turn);
        int j = (i+1) % turns.size();
        debate.setTurn(turns.get(j));





        debate.getMessages().add(message);

        webSocketController.pushMessage(id,message);

        return message;

    }

}
