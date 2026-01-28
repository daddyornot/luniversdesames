package fr.daddyornot.universdesames.repository;

import fr.daddyornot.universdesames.model.Stone;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface StoneRepository extends JpaRepository<Stone, Long> {
    Optional<Stone> findByName(String name);
}
