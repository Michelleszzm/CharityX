package com.charity.x.dto.response;


import com.charity.x.dto.vo.CharityDonorNoteVo;
import io.github.linpeilie.annotations.AutoMapper;
import lombok.Data;

import java.time.LocalDateTime;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonorNoteVo.class)
public class DonorNoteDetailResponse {

    private String note;

    private LocalDateTime createTime;
}
