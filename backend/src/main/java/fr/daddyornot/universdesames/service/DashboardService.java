package fr.daddyornot.universdesames.service;

import fr.daddyornot.universdesames.model.Order;
import fr.daddyornot.universdesames.repository.OrderRepository;
import fr.daddyornot.universdesames.repository.ProductRepository;
import fr.daddyornot.universdesames.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DashboardService {
    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final ProductRepository productRepository;

    public Map<String, Object> getStats(String period, LocalDate customStart, LocalDate customEnd) {
        List<Order> allOrders = orderRepository.findAll();
        LocalDate now = LocalDate.now();
        LocalDate startDate;
        LocalDate endDate = now;

        if (period == null) period = "CURRENT_MONTH";

        switch (period) {
            case "CUSTOM":
                startDate = customStart != null ? customStart : now.minusMonths(1);
                endDate = customEnd != null ? customEnd : now;
                break;
            case "LAST_MONTH":
                startDate = now.minusMonths(1).withDayOfMonth(1);
                endDate = now.withDayOfMonth(1).minusDays(1);
                break;
            case "LAST_3_MONTHS":
                startDate = now.minusMonths(3);
                break;
            case "LAST_6_MONTHS":
                startDate = now.minusMonths(6);
                break;
            case "CURRENT_YEAR":
                startDate = LocalDate.of(now.getYear(), 1, 1);
                break;
            case "CURRENT_MONTH":
            default:
                startDate = now.withDayOfMonth(1);
                break;
        }

        // Filter orders based on period
        LocalDate finalStartDate = startDate;
        LocalDate finalEndDate = endDate;
        List<Order> filteredOrders = allOrders.stream()
                .filter(o -> {
                    LocalDate orderDate = o.getCreatedAt().toLocalDate();
                    return !orderDate.isBefore(finalStartDate) && !orderDate.isAfter(finalEndDate);
                })
                .toList();

        double totalRevenue = filteredOrders.stream().mapToDouble(Order::getTotalAmount).sum();
        long totalOrders = filteredOrders.size();
        long totalUsers = userRepository.count();
        long newCustomers = filteredOrders.stream().map(Order::getCustomerEmail).distinct().count();

        // Chart Data
        List<Map<String, Object>> salesChart = new ArrayList<>();

        long daysBetween = ChronoUnit.DAYS.between(startDate, endDate);

        if (daysBetween <= 60) {
            // Daily breakdown
            Map<LocalDate, Double> dailySales = filteredOrders.stream()
                    .collect(Collectors.groupingBy(
                            o -> o.getCreatedAt().toLocalDate(),
                            Collectors.summingDouble(Order::getTotalAmount)
                    ));

            for (LocalDate date = startDate; !date.isAfter(endDate); date = date.plusDays(1)) {
                salesChart.add(Map.of(
                        "label", date.format(DateTimeFormatter.ofPattern("dd/MM")),
                        "value", dailySales.getOrDefault(date, 0.0)
                ));
            }
        } else {
            // Monthly breakdown
            Map<YearMonth, Double> monthlySales = filteredOrders.stream()
                    .collect(Collectors.groupingBy(
                            o -> YearMonth.from(o.getCreatedAt()),
                            Collectors.summingDouble(Order::getTotalAmount)
                    ));

            YearMonth startMonth = YearMonth.from(startDate);
            YearMonth endMonth = YearMonth.from(endDate);

            for (YearMonth month = startMonth; !month.isAfter(endMonth); month = month.plusMonths(1)) {
                salesChart.add(Map.of(
                        "label", month.getMonth().name().substring(0, 3),
                        "value", monthlySales.getOrDefault(month, 0.0)
                ));
            }
        }

        return Map.of(
            "totalRevenue", totalRevenue,
            "totalOrders", totalOrders,
            "totalUsers", totalUsers,
            "newCustomers", newCustomers,
            "salesChart", salesChart,
            "totalAppointments", 0
        );
    }

    // Overload for backward compatibility if needed
    public Map<String, Object> getStats(String period) {
        return getStats(period, null, null);
    }
}
