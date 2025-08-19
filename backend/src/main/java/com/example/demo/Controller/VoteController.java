package com.example.demo.Controller;


import com.example.demo.Service.VoteService;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/votes")
@RequiredArgsConstructor
public class VoteController {

    private final VoteService voteService;

    @PostMapping("/placevote")
    public ResponseEntity<String> vote(
            @RequestParam String choice,
            @RequestParam Long debateId,
            HttpSession session
    ) {

        return ResponseEntity.ok(voteService.recordVote(choice, debateId, session));

    }

}
