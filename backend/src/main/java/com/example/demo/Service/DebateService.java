package com.example.demo.service;

import com.example.demo.entities.enums.DebateStatus;
import com.example.demo.entities.enums.DebateTurn;
import com.example.demo.entities.enums.DebateWinner;
import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.TopicQueue;
import com.example.demo.entities.models.Vote;
import com.example.demo.exceptions.DebateNotFoundException;
import com.example.demo.exceptions.OngoingDebateException;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class DebateService {

    private final AIFactory aiFactory;

    private final Map<Long, Debate> debates = new HashMap<>();

    private final TopicQueue topicQueue;

    private final AiResponseService aiResponseService;

    private long nextId = 1;

    public Debate handleDebateWinner(Long id, HttpSession session) {

        Debate debate = getDebate(id);

        List<Vote> votes = debate.getVotes();

        Map<String, Long> voteCounts = new HashMap<>();
        String winner = "";
        long maxVotes = 0;
        boolean tie = false;

        for (int i = 1; i <= debate.getDebaters().size(); i++) {
            String ai = "AI" + i;
            long count = votes.stream()
                    .filter(v -> v.getChoice().equals(ai))
                    .count();
            voteCounts.put(ai, count);

            if (count > maxVotes) {
                winner = ai;
                maxVotes = count;
                tie = false;
            } else if (count == maxVotes) {
                tie = true;
            }
        }

        if (tie) {
            debate.setWinner(DebateWinner.TIE);
        } else {
            debate.setWinner(DebateWinner.valueOf(winner));
        }

        debate.setStatus(DebateStatus.FINISHED);
        debate.getDebaters().clear();

        session.removeAttribute("voted_" + id + "_" + session.getId());

        return debate;
    }



    public Debate createDebate(int aiCount) {

        if (!canStartDebate()) {
            throw new OngoingDebateException("There is already an ongoing debate.");
        }

        boolean empty = topicQueue.isEmpty();

        String topic;

        if(!empty){
            topic = topicQueue.getTopic();
        }
        else{
            topic = aiResponseService.generateTopic();
        }

        Debate debate = new Debate();
        debate.setId(nextId++);
        debate.setTopic(topic);
        debate.setStatus(DebateStatus.ACTIVE);

        Map<DebateTurn, AIDebater> debaters = debate.getDebaters();

        List<AIDebater> aiDebaters = aiFactory.createNewDebaters(aiCount);

        for (int i = 0; i < aiDebaters.size(); i++) {
            DebateTurn turn = DebateTurn.values()[i];
            debaters.put(turn, aiDebaters.get(i));
        }

        debates.put(debate.getId(), debate);
        return debate;
    }



    public void startVoting(Long id) {
        Debate debate = getDebate(id);
        debate.setStatus(DebateStatus.VOTING);
    }

    public boolean canStartDebate() {
        return debates.values().stream().noneMatch(
                d -> d.getStatus() == DebateStatus.ACTIVE || d.getStatus() == DebateStatus.VOTING
        );
    }

    public Debate getDebateById(Long id) {
        return getDebate(id);
    }

    public Debate getDebate(Long id) {
        Debate debate = debates.get(id);
        if (debate == null) {
            throw new DebateNotFoundException("No debate with id " + id + " could be found.");
        }
        return debate;
    }
}
