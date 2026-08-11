package com.aisafetyaudit.service;

import com.aisafetyaudit.dto.notification.NotificationResponse;
import com.aisafetyaudit.entity.Notification;
import com.aisafetyaudit.entity.Report;
import com.aisafetyaudit.entity.User;
import com.aisafetyaudit.exception.ResourceNotFoundException;
import com.aisafetyaudit.repository.NotificationRepository;
import com.aisafetyaudit.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    @Transactional
    public Notification notify(User user, String title, String body, Report relatedReport) {
        Notification notification = Notification.builder()
                .user(user)
                .title(title)
                .body(body)
                .relatedReport(relatedReport)
                .build();
        notification = notificationRepository.save(notification);

        // Live push over WebSocket to /topic/notifications.{userId}
        messagingTemplate.convertAndSend(
                "/topic/notifications." + user.getId(),
                toResponse(notification)
        );

        return notification;
    }

    public List<NotificationResponse> listForUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(user.getId())
                .stream().map(this::toResponse).toList();
    }

    public long unreadCount(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return notificationRepository.countByUserIdAndReadFalse(user.getId());
    }

    @Transactional
    public NotificationResponse markRead(UUID id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Notification not found: " + id));
        n.setRead(true);
        return toResponse(n);
    }

    private NotificationResponse toResponse(Notification n) {
        return new NotificationResponse(
                n.getId(), n.getTitle(), n.getBody(), n.isRead(),
                n.getRelatedReport() != null ? n.getRelatedReport().getId() : null,
                n.getCreatedAt()
        );
    }
}
