package fr.daddyornot.universdesames.model.dto;

import io.swagger.v3.oas.annotations.media.Schema;

import java.util.List;

public record DashboardStats(
    @Schema(example = "1250.50")
    Double totalRevenue,

    Long totalOrders,
    Long totalAppointments,
    Long newCustomers,

    @Schema(description = "Données pour le graphique des ventes")
    List<SalesDataPoint> salesChart
) {
    public record SalesDataPoint(
        @Schema(example = "Janvier") String label,
        @Schema(example = "450.0") Double value
    ) {
    }
}
