package com.example.demo.service;

import com.example.demo.entities.enums.DebateRound;
import com.example.demo.entities.models.AIDebater;
import com.example.demo.entities.models.Response;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ArrayNode;
import com.fasterxml.jackson.databind.node.ObjectNode;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.CompletableFuture;

@Service
public class AiResponseService {

    private final WebClient webClient;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Value("${huggingface.api.key}")
    private String apiKey;

    public AiResponseService() {
        this.webClient = WebClient.builder()
                .baseUrl("https://router.huggingface.co/v1/chat/completions")
                .defaultHeader("Content-Type", "application/json")
                .build();
    }


    public List<String> generateMultipleTexts(String topic, List<Response> lastMessages,
                                              List<AIDebater> debateAis, DebateRound round) {


        StringBuilder previousMessages = new StringBuilder();
        int start = Math.max(0, lastMessages.size() - 5);
        for (int i = start; i < lastMessages.size(); i++) {
            Response msg = lastMessages.get(i);
            previousMessages.append(msg.getSender())
                    .append(": ")
                    .append(msg.getContent())
                    .append("\n");
        }


        String roundInstructions = switch (round) {
            case OPENING -> "Introduce your main argument on the topic. Stick with your side for the rest of the debate.";

            case REBUTTAL -> "Respond to opposing arguments made so far. Try to invalidate other arguments, and refer to other AI messages sent above." +
                    "Do not refer to your own messages. If there are no other messages by other ai's, try to reinforce your point further with your own reasoning.";

            case CROSSTALK -> "Engage directly with other debaters. You must pick at least one message from above to respond to and " +
                    "preferably refer to the sender by name. Do not refer to your own messages. If there are no other messages by other ai's, you may refer to your own messages to double down and prove them further.";

            case CLOSING -> "Give a final summary of your position and strongest points.";
        };

        String soloRoundInstructions = switch (round) {
            case OPENING -> "Introduce your main argument on the topic. Do not switch your argument after its chosen.";

            case REBUTTAL -> "Try to bring up some possible points that can invalidate your argument, and try to evaluate and disagree with them.";

            case CROSSTALK -> "Think out loud about your argument. Pretend you are anticipating what an opponent might say and respond to it, as if you were in a live debate. " +
                    "Challenge your own points briefly, then reinforce why your stance still holds.";

            case CLOSING -> "Give a final summary of your position and strongest points.";
        };

        boolean allSame = lastMessages.stream()
                .map(Response::getSender)
                .distinct()
                .count() <= 1;

        System.out.println(allSame ? "Solo ai" : "Not solo ai");


        List<CompletableFuture<String>> futures = new ArrayList<>();
        for (AIDebater debater : debateAis) {
            String prompt = "You are an AI debater.\n" +
                    "Debate topic: \"" + topic + "\"\n" +
                    "Your style is: \"" + debater.getStyle().name() + "\"\n" +
                    "Round: \"" + round.name() + "\"\n\n" +
                    "Do not be too formal. Be casual and participate like a human, unless your style is creative, then use poetic or creative words.\n" +
                    (allSame ? soloRoundInstructions  : roundInstructions) + "\n\n" +
                    "Previous messages (you may respond, agree, or disagree):\n" +
                    (previousMessages.isEmpty() || allSame ? "None" : previousMessages) + "\n\n" +
                    "Do not respond to any messages sent by " + debater.getStyle().name() + ".\n\n" +
                    "Your response should be in simple, human-like words, max 2 sentences.";

            futures.add(CompletableFuture.supplyAsync(() -> callHuggingFaceApi(prompt)));
        }


        return futures.stream()
                .map(CompletableFuture::join)
                .toList();
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
            return jsonResponse.path("choices").get(0).path("message").path("content").asText();
        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }
}
