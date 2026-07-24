package com.ramentaku.backend.repository;

import com.ramentaku.backend.domain.Ramen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RamenRepository extends JpaRepository<Ramen, Long> {
    
}
