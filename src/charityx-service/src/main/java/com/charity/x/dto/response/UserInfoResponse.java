package com.charity.x.dto.response;

import com.charity.x.dto.vo.CharityNonprofitMergeVo;
import com.charity.x.dto.vo.SysUserVo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * @Author: Lucass @Date: 2025/11/10 13:45 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponse {

    private SysUserVo sysUserVo;

    private CharityNonprofitMergeVo charityNonprofitMergeVo;
}
