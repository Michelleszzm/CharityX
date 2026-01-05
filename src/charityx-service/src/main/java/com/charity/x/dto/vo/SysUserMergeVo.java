package com.charity.x.dto.vo;

import lombok.*;

import java.io.Serial;

/**
 * @Author: Lucass @Date: 2025/11/6 13:22 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class SysUserMergeVo extends BaseVo{
    @Serial
    private static final long serialVersionUID = -8900982176663087977L;

    private Boolean check;

    private SysUserVo sysUserVo;
}
