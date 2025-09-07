package com.example.demo.entities.models.dtos;

import com.example.demo.entities.models.Response;
import lombok.Getter;
import lombok.Setter;

import java.util.List;
import java.util.Map;

@Getter
@Setter
public class DebateResponse {

    private List<String> selected_ais;

    private String topic;

    private long id;

    private Map<String, List<Response>> rounds_data;

    private String current_round;


}
