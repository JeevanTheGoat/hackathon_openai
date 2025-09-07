package com.example.demo.entities.models;


import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Vote {

    private String bestArgument;

    private String funniest;

    private String mostCreative;

}
