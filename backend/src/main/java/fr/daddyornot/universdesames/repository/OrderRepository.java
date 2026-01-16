package fr.daddyornot.universdesames.repository;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
}
