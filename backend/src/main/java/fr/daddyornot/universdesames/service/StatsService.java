package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.model.dto.DashboardStats;
import fr.daddyornot.universdesames.repository.OrderRepository;
import fr.daddyornot.universdesames.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StatsService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    public DashboardStats getStats(String period) {
        LocalDateTime startDate = calculateStartDate(period);
        LocalDateTime endDate = LocalDateTime.now();

        List<Order> orders = orderRepository.findAll().stream()
                .filter(o -> o.getCreatedAt().isAfter(startDate) && o.getCreatedAt().isBefore(endDate))
                .toList();

        Double totalRevenue = orders.stream().mapToDouble(Order::getTotalAmount).sum();
        Long totalOrders = (long) orders.size();
        
        // Estimation simple des RDV (basée sur les items qui ont une date)
        Long totalAppointments = orders.stream()
                .flatMap(o -> o.getItems().stream())
                .filter(i -> i.getAppointmentDate() != null)
                .count();

        // Nouveaux clients (approximatif, basé sur la date de création si on l'avait, ici on compte les users uniques des commandes)
        Long newCustomers = orders.stream()
                .map(Order::getCustomerEmail)
                .distinct()
                .count();

        // Données pour le graphique (groupées par jour ou mois selon la période)
        List<DashboardStats.SalesDataPoint> chartData = generateChartData(orders, period);

        return new DashboardStats(totalRevenue, totalOrders, totalAppointments, newCustomers, chartData);
    }

    private LocalDateTime calculateStartDate(String period) {
        LocalDateTime now = LocalDateTime.now();
        return switch (period) {
            case "CURRENT_MONTH" -> now.withDayOfMonth(1).withHour(0).withMinute(0);
            case "LAST_MONTH" -> now.minusMonths(1).withDayOfMonth(1).withHour(0).withMinute(0); // Début du mois dernier
            case "LAST_3_MONTHS" -> now.minusMonths(3);
            case "LAST_6_MONTHS" -> now.minusMonths(6);
            case "CURRENT_YEAR" -> now.withDayOfYear(1).withHour(0).withMinute(0);
            default -> now.minusMonths(1);
        };
    }

    private List<DashboardStats.SalesDataPoint> generateChartData(List<Order> orders, String period) {
        boolean groupByMonth = period.equals("LAST_6_MONTHS") || period.equals("CURRENT_YEAR");
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(groupByMonth ? "MMM yyyy" : "dd/MM");

        Map<String, Double> groupedData = orders.stream()
                .collect(Collectors.groupingBy(
                        o -> o.getCreatedAt().format(formatter),
                        Collectors.summingDouble(Order::getTotalAmount)
                ));

        // On transforme la map en liste triée (simplifié ici, l'ordre dépend du hashmap)
        // Pour une vraie prod, il faudrait itérer sur les dates de la période et remplir les trous avec 0
        return groupedData.entrySet().stream()
                .map(e -> new DashboardStats.SalesDataPoint(e.getKey(), e.getValue()))
                .toList();
    }
}
