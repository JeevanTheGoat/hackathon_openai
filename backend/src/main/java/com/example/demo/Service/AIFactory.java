package com.example.demo.service;

import com.example.demo.entities.AIDebater;
import com.example.demo.entities.Strength;
import com.example.demo.entities.Style;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Service
public class AIFactory {

    Random rand = new Random();

    public List<AIDebater> createNewDebaters(int aiCount) {

        List<AIDebater> aiDebaters = new ArrayList<>();

        List<Style> styles = new ArrayList<>(Arrays.asList(Style.values()));
        List<Strength> strengths = new ArrayList<>(Arrays.asList(Strength.values()));

        for (int i = 0; i < aiCount; i++) {

            AIDebater aiDebater = new AIDebater();


            Style style = styles.remove(rand.nextInt(styles.size()));
            Strength strength = strengths.remove(rand.nextInt(strengths.size()));

            aiDebater.setStyle(style);
            aiDebater.setStrength(strength);
            aiDebater.setId(i + 1);

            aiDebaters.add(aiDebater);
        }

        return aiDebaters;
    }
}
