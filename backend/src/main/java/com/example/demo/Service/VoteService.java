package com.example.demo.Service;



import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.Vote;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class VoteService {


    private final DebateService debateService;
    private final AIFactory aiFactory;

    public Vote recordVote(Vote vote, Long id){

        Debate debate = debateService.getDebateById(id);

        debate.getVotes().add(vote);



        for(AIDebater aiDebater: aiFactory.getMasterAIs()){

            String name = aiDebater.getStyle().toString();

            if(name.equals(vote.getFunniest())){
                aiDebater.setFunnyVotes(aiDebater.getFunnyVotes() + 1);
            }
            if(name.equals(vote.getMostCreative())){
                aiDebater.setCreativeVotes(aiDebater.getCreativeVotes() + 1);
            }
            if(name.equals(vote.getBestArgument())){
                aiDebater.setWins(aiDebater.getWins() + 1);
            }

        }



        return vote;

    }


}
