package com.charity.x.dto.entity;

import lombok.Data;
import lombok.EqualsAndHashCode;

import java.io.Serial;

/**
 * @Author: Lucass @Date: 2025/11/7 15:26 @Description:
 */
@Data
@EqualsAndHashCode(callSuper = true)
public class CharityDonorNote extends BaseEntity{

    @Serial
    private static final long serialVersionUID = 6644712623505071104L;

    private String chain;

    private String wallet;

    private String node;
}
