package com.charity.x.dto.vo;

import java.io.Serial;
import java.math.BigDecimal;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
public class CharityNonprofitFundraisingConfigAllocation{

    @Serial
    private static final long serialVersionUID = 7557506279741059422L;

    @Valid
    @NotEmpty.List(@NotEmpty(message = "purpose can not empty"))
    private List<Purpose> purposeList;

    @Data
    public static class Purpose {
        @NotNull(message = "purpose description can not null")
        private String name;

        @NotNull(message = "purpose percent can not null")
        private BigDecimal percent;
    }
}
