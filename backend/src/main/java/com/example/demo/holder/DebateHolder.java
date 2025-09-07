package com.example.demo.holder;

import com.example.demo.entities.models.Debate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;

@Service
public class DebateHolder {

    private Map<Long, Debate> debates;

    DebateHolder(){
        debates = new HashMap<>();
    }

    public Map<Long, Debate> getDebates(){
        return debates;
    }



}
