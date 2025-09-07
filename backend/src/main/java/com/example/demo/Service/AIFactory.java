package com.example.demo.service;

import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.enums.Strength;
import com.example.demo.entities.enums.Style;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Service
public class AIFactory {

    private final List<AIDebater> masterAIs = new ArrayList<>();
    Random rand = new Random();

    public AIFactory() {

        int idCounter = 1;

        for(Style style: Style.values()){
            AIDebater aiDebater = new AIDebater();
            aiDebater.setId(idCounter);
            aiDebater.setStyle(style);
            idCounter++;
            masterAIs.add(aiDebater);
        }
    }


    public List<AIDebater> getMasterAIs() {
        return masterAIs;
    }

    public List<AIDebater> createDebateAIs(List<String> aiNames){

        List<AIDebater> masterAis = getMasterAIs();
        List<AIDebater> tempAis = new ArrayList<>();
        List<AIDebater> debateAis = new ArrayList<>();



        for(String aiName: aiNames){

            AIDebater debateAI = new AIDebater();


            AIDebater matchingMasterAi = masterAis.stream()
                    .filter(m -> m.getStyle().name().equals(aiName))
                    .findFirst()
                    .orElseThrow(() -> new RuntimeException("No master AI found for style: " + aiName));

            debateAI.setStyle(matchingMasterAi.getStyle());
            debateAI.setStrength(Strength.values()[rand.nextInt(Strength.values().length)]);


            debateAI.setId(matchingMasterAi.getId()*10);
            debateAis.add(debateAI);

        }
        return debateAis;
    }
}

