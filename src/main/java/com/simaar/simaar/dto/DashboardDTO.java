package com.simaar.simaar.dto;

import lombok.Data;

@Data
public class DashboardDTO {
    private Long totalOrders;
    private Long pendingOrders;
    private Long acceptedOrders;
    private Long cancelledOrders;
    private Long totalUsers;
    private Long totalBouquets;
}
