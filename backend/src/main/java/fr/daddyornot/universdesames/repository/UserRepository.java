package fr.daddyornot.universdesames.repository;

import fr.daddyornot.universdesames.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
}
