package com.example.demo.Service;


import com.example.demo.Repository.DebateRepository;
import com.example.demo.Entities.Debate;
import com.example.demo.Entities.DebateStatus;
import com.example.demo.Entities.DebateWinner;
import com.example.demo.Entities.Vote;
import com.example.demo.Exceptions.DebateNotFoundException;
import com.example.demo.Exceptions.OngoingDebateException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
@RequiredArgsConstructor
public class DebateService {

    private final DebateRepository debateRepository;

    public Debate handleDebateWinner(Long id, HttpSession session){


        Debate debate = getDebate(id);

        List<Vote> votes = debate.getVotes();

        long voteForAI1 = votes.stream()
                .filter(v -> v.getChoice().equals("AI1")).count();

        long voteForAI2 = votes.stream()
                .filter(v -> v.getChoice().equals("AI2")).count();


        if(voteForAI2==voteForAI1){
            debate.setWinner(DebateWinner.TIE);
        }
        else if(voteForAI2>voteForAI1){
            debate.setWinner(DebateWinner.AI2);
        }
        else{
            debate.setWinner(DebateWinner.AI1);
        }

        debate.setStatus(DebateStatus.FINISHED);

        session.removeAttribute("voted_" + id + "_" + session.getId());

        return debateRepository.save(debate);


    }

    public Debate createDebate(String topic){


        if(!canStartDebate()){
            throw new OngoingDebateException("There is already an ongoing debate.");
        }

        Debate debate = new Debate();
        debate.setTopic(topic);
        debate.setStatus(DebateStatus.ACTIVE);

        return debateRepository.save(debate);

    }


    public void startVoting(Long id){

        Debate debate = debateRepository.findById(id)
                .orElseThrow(() -> new DebateNotFoundException("Debate not found."));

        debate.setStatus(DebateStatus.VOTING);
        debateRepository.save(debate);

    }

    public boolean canStartDebate(){

        boolean activeDebatePresent = debateRepository.existsByStatus(DebateStatus.ACTIVE);

        boolean votingDebatePresent = debateRepository.existsByStatus(DebateStatus.VOTING);

        return !(votingDebatePresent || activeDebatePresent);

    }

    public Debate getDebateById(Long id){
        return getDebate(id);
    }


    public Debate getDebate(Long id){
        return debateRepository.findById(id)
                .orElseThrow(()-> new DebateNotFoundException("No debate with id " + id +" could be found."));
    }

}
