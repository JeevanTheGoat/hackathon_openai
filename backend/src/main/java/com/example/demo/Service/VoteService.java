package com.example.demo.Service;

import com.example.demo.Entities.DebateStatus;
import com.example.demo.Repository.DebateRepository;
import com.example.demo.Repository.VoteRepository;
import com.example.demo.Entities.Debate;
import com.example.demo.Entities.Vote;
import com.example.demo.Exceptions.DebateNotFoundException;
import com.example.demo.Exceptions.MultipleVotesException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoteService {

    private final DebateRepository debateRepository;
    private final VoteRepository voteRepository;
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

        debateRepository.save(debate);
        voteRepository.save(vote);


        session.setAttribute("voted_"+debateId+"_"+session.getId(), true);

        return "Vote has been recorded.";





    }


}
