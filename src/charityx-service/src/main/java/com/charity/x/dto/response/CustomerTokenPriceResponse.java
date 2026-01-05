package com.charity.x.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-20
 * @Description:
 * @Version: 1.0
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class CustomerTokenPriceResponse {

    private String token;

    private BigDecimal price;
}
