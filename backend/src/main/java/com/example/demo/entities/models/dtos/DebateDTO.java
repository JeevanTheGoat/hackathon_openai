package com.example.demo.entities.models.dtos;

import lombok.Data;

import java.util.List;

@Data
public class DebateDTO {

    private List<String> selected_ais;

    private String topic;

    private boolean user_participated;

}
