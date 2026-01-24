package fr.daddyornot.universdesames.model.dto;

import java.util.List;

public record DashboardStats(
    Double totalRevenue,
    Long totalOrders,
    Long totalAppointments,
    Long newCustomers,
    List<SalesDataPoint> salesChart
) {
    public record SalesDataPoint(String label, Double value) {}
}
