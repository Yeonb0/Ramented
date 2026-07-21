package com.ramented.backend.repository;

import com.ramented.backend.domain.Ramen;
import org.springframework.data.jpa.repository.JpaRepository;

public interface RamenRepository extends JpaRepository<Ramen, Long> {
    
}
