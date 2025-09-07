package com.example.demo.entities.models;


import com.example.demo.entities.enums.Strength;
import com.example.demo.entities.enums.Style;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AIDebater {

    private long id;

    private Strength strength;

    private Style style;

    private int funnyVotes;

    private int creativeVotes;

    private int wins;

    private int played;

}
