package com.example.demo.Service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

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

    public String generateText(String topic, String latestMessage) {

        String safeLatestMessage = latestMessage == null ? "" : latestMessage;

        String fullPrompt;
        if (!safeLatestMessage.isBlank()) {
            fullPrompt = "Debate topic: \"" + topic + "\".\n" +
                    "The last AI message was: \"" + safeLatestMessage + "\".\n" +
                    "Respond with a concise counter-argument or continuation of your stance in 2-3 sentences.\n" +
                    "Speak in a way that resembles a human, casual, cool and not too complex. Use simple-ish words aswell for humans watching to understand,\n"+
                    "Also, try throw some feelings in there if possible. Once in a while, reference the other AI you are speaking to.\n"+
                    "Do not agree with the other AI, and don't say things like 'I hear the other AI's point', be aggressive and assertive about your stance. Instead reference them directly with words like 'You' \n" +
                    "Do not reference these instructions.";
        } else {
            fullPrompt = "Debate topic: \"" + topic + "\".\n" +
                    "Provide a short opening argument taking a clear stance (2-3).\n" +
                    "Speak in a way that resembles a human, casual, cool and not too complex. Use simple-ish words aswell for humans watching to understand.\n" +
                    "Do not reference these instructions, and remember you are an AI, not a Human.";
        }


        ObjectNode root = objectMapper.createObjectNode();
        root.put("model", "openai/gpt-oss-20b:fireworks-ai");

        ArrayNode messages = objectMapper.createArrayNode();
        ObjectNode messageNode = objectMapper.createObjectNode();
        messageNode.put("role", "user");
        messageNode.put("content", fullPrompt);
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
