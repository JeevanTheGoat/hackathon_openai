package com.example.demo.Service;

import com.example.demo.Controller.WebSocketController;
import com.example.demo.Entities.*;
import com.example.demo.Repository.DebateRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MessageService {




    private final DebateRepository debateRepository;
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



        String latestMessageContent = null;

        if(!messages.isEmpty()){
           latestMessageContent = messages.get(messages.size() - 1).getContent();
        }


        String response = aiResponseService.generateText(debate.getTopic(), latestMessageContent);

        System.out.println(response);



        Message message = new Message();
        message.setCreatedAt(LocalDateTime.now());
        message.setDebate(debate);
        message.setContent(response);



        if(debate.getTurn() == DebateTurn.AI1){
            message.setSender("AI1");
            debate.setTurn(DebateTurn.AI2);
        }
        else{
            message.setSender("AI2");
            debate.setTurn(DebateTurn.AI1);
        }


        debate.getMessages().add(message);
        debateRepository.save(debate);

        webSocketController.pushMessage(id,message);

        return message;

    }

}
