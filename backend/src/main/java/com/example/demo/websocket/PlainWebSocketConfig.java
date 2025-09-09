package com.example.demo.websocket;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSocket
@RequiredArgsConstructor
public class PlainWebSocketConfig implements WebSocketConfigurer {

    private final DebateWebSocketHandler debateWebSocketHandler;

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(debateWebSocketHandler, "/debates/{debateId}/live")
                .setAllowedOrigins("http://localhost:5173");


    }
}
