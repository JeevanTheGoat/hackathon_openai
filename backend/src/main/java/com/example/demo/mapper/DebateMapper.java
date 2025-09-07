package com.example.demo.mapper;

import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Debate;
import com.example.demo.entities.models.dtos.DebateResponse;

import java.util.ArrayList;
import java.util.List;

public class DebateMapper {

    public static DebateResponse debateToDTO(Debate debate){

        DebateResponse response = new DebateResponse();
        response.setId(debate.getId());
        response.setTopic(debate.getTopic());
        response.setCurrent_round(debate.getRound().name().toLowerCase());
        response.setRounds_data(debate.getRoundsData());

        List<String> selected_ais = new ArrayList<>();

        for(AIDebater debater: debate.getDebaters()){
            selected_ais.add(debater.getStyle().name());
        }
        response.setSelected_ais(selected_ais);

        return response;
    }

}
