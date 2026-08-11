package com.aisafetyaudit.repository;

import com.aisafetyaudit.entity.Factory;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface FactoryRepository extends JpaRepository<Factory, UUID> {
}
