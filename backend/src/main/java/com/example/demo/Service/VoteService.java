package com.example.demo.service;


import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.Vote;
import com.example.demo.exceptions.MultipleVotesException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoteService {


    private final DebateService debateService;

    public String recordVote(String choice, Long debateId, HttpSession session){

        if(session.getAttribute("voted_"+debateId+"_"+session.getId()) != null){
            throw new MultipleVotesException("Multiple votes must not be placed.");
        }



        Debate debate = debateService.getDebate(debateId);

        Vote vote = new Vote();
        vote.setChoice(choice);
        vote.setDebate(debate);


        debate.getVotes().add(vote);


        session.setAttribute("voted_"+debateId+"_"+session.getId(), true);

        return "Vote has been recorded.";





    }


}
