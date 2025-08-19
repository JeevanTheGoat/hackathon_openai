package com.example.demo.Controller;

import com.example.demo.Entities.Message;
import com.example.demo.Service.MessageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/messages")
@RequiredArgsConstructor
public class MessageController {

    private final MessageService messageService;

    @GetMapping("/{id}")
    public ResponseEntity<List<Message>> getMessagesByDebateId(@PathVariable Long id){
        return ResponseEntity.ok(messageService.getMessagesByDebateId(id));
    }

    @PostMapping("/{id}")
    public Message addMessage(
            @PathVariable Long id)
    {

        return messageService.addMessage(id);
    }


}
