package com.example.demo.service;

import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Message;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
public class AiResponseService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${huggingface.api.key}")
    String apiKey;

    public AiResponseService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://router.huggingface.co/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }

    public String generateTopic(){
        String topicRequest = "Generate an interesting topic for a debate. (1-2 sentences max). Only return the topic, and it does not need to include AI.";
        return callHuggingFaceApi(topicRequest);
    }


    public String generateText(String topic, List<Message> lastMessages, AIDebater aiDebater) {

        StringBuilder previousMessages = new StringBuilder();


        int start = Math.max(0, lastMessages.size() - 3);
        for (int i = start; i < lastMessages.size(); i++) {
            Message msg = lastMessages.get(i);
            previousMessages.append(msg.getSender())
                    .append(": ")
                    .append(msg.getContent())
                    .append("\n");
        }

        String style = aiDebater.getStyle().name();
        String strength = aiDebater.getStrength().name();

        String fullPrompt = "You are an AI debater.\n" +
                "Topic: \"" + topic + "\"\n" +
                (previousMessages.isEmpty() ? "" : "Previous messages:\n" + previousMessages) +
                "Speak in simple, human-like words, maximum 2 sentences.\n" +
                "Your style: \"" + style + "\"\n" +
                "Your position: \"" + strength + "\"\n" +
                "Respond based on your position, and you may agree, disagree, or challenge previous points.\n" +
                "To strengthen your point, you may try to respond to previous claims made in other messages that you disagree with.";

        return callHuggingFaceApi(fullPrompt);
    }

    private String callHuggingFaceApi(String prompt) {
        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", "openai/gpt-oss-20b:fireworks-ai");

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode messageNode = objectMapper.createObjectNode();
        messageNode.put("role", "user");
        messageNode.put("content", prompt);
        messages.add(messageNode);
        root.set("messages", messages);

        String body;
        try {
            body = objectMapper.writeValueAsString(root);
        } catch (Exception e) {
            throw new RuntimeException("Failed to serialize JSON body", e);
        }

        String response = webClient.post()
                .header("Authorization", "Bearer " + apiKey)
                .bodyValue(body)
                .retrieve()
                .bodyToMono(String.class)
                .block();

        try {
            JsonNode jsonResponse = objectMapper.readTree(response);
            return jsonResponse
                    .path("choices")
                    .get(0)
                    .path("message")
                    .path("content")
                    .asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }
}
