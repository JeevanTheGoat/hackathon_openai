package com.example.demo.service;

import com.example.demo.controller.WebSocketController;
import com.example.demo.entities.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
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




        switch (turn) {
            case AI1 -> debate.setTurn(DebateTurn.AI2);
            case AI2 -> debate.setTurn(DebateTurn.AI3);
            case AI3 -> debate.setTurn(DebateTurn.AI4);
            case AI4 -> debate.setTurn(DebateTurn.AI5);
            case AI5 -> debate.setTurn(DebateTurn.AI1);
        }

        debate.getMessages().add(message);

        webSocketController.pushMessage(id,message);

        return message;

    }

}
