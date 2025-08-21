package com.example.demo.entities.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Vote {


    private Long id;

    @JsonBackReference
    private Debate debate;

    private String choice;

}
