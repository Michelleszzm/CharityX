package com.charity.x.dto.response;

import com.charity.x.dto.vo.CharityNonprofitCheckRecordVo;
import com.charity.x.dto.vo.SysUserVo;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/11 19:00 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ApplicationDetailResponse {

    private String nonprofitName;

    private String proofImage;

    private Integer status;

    private SysUserVo sysUserVo;

    private List<CharityNonprofitCheckRecordVo> checkRecordVoList;
}
