package com.charity.x.dto.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
public class DonationWalletMergeResponse {

    private UserDetailResponse user;

    private DonorsListResponse summary;

    private List<DonationRecordResponse> recordList;

    private List<DonorNoteDetailResponse> noteList;
}
