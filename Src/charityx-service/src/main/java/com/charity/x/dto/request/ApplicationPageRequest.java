package com.charity.x.dto.request;

import com.charity.x.dto.vo.BasePageVo;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * @Author: Lucass @Date: 2025/11/11 09:12 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Filter parameters for review-related lists")
public class ApplicationPageRequest extends BasePageVo {

    @Schema(description = "Email")
    private String email;

    @Schema(description = "Nonprofit organization name")
    private String nonprofitName;
}
