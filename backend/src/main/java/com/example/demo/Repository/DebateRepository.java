package com.example.demo.Repository;

import com.example.demo.Entities.Debate;
import com.example.demo.Entities.DebateStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DebateRepository extends JpaRepository<Debate, Long> {

    boolean existsByStatus(DebateStatus debateStatus);

}
