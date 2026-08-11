package com.aisafetyaudit.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * Enables STOMP-over-WebSocket at /ws. Clients (the mobile app) connect
 * there and subscribe to per-user/per-upload topics, e.g.:
 *   /topic/notifications.{userId}
 *   /topic/uploads.{uploadId}.status
 */
@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    @Override
    public void configureMessageBroker(MessageBrokerRegistry registry) {
        registry.enableSimpleBroker("/topic");
        registry.setApplicationDestinationPrefixes("/app");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Web clients (SockJS fallback for browsers that block raw WebSocket)
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();

        // React Native / native clients — plain WebSocket, no SockJS handshake
        registry.addEndpoint("/ws-native")
                .setAllowedOriginPatterns("*");
    }
}
