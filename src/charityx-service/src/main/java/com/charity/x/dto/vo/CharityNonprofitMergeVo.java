package com.charity.x.dto.vo;

import java.io.Serial;

import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class CharityNonprofitMergeVo extends BaseVo {

    @Serial
    private static final long serialVersionUID = -2317136354064787909L;
    
    private String nonprofitName;

    private String proofImage;

    private Integer status;

    private Boolean isActive;
}
