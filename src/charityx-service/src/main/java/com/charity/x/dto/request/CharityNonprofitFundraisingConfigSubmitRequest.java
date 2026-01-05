package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

import java.io.Serial;
import java.io.Serializable;

@Data
public class CharityNonprofitFundraisingConfigSubmitRequest implements Serializable {
    @Serial
    private static final long serialVersionUID = -5226229088937326016L;

    /**
     * Exclude profile, about, fundraising, applications, management, reports
     */
    @NotEmpty(message = "site can not empty")
    @Pattern(
            regexp = "^(?!(profile|about|fundraising|applications|management|reports)$).+",
            message = "site can not be [profile, about, fundraising, applications, management, reports]"
    )
    @Schema(description = "Site" , example = "ABCD")
    private String site;

}
