package com.charity.x.dto.request;


import com.charity.x.dto.vo.CharityDonationRecordVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-22
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonationRecordVo.class, reverseConvertGenerate = false)
@NotNull
@Schema(description = "Customer query donation record request parameters", requiredMode = Schema.RequiredMode.REQUIRED)
public class CustomerReceiptWithNftRequest {

    @NotNull(message = "donorWallet can not empty")
    @Schema(description = "donorWallet wallet address", example = "0x1234567890",requiredMode = Schema.RequiredMode.REQUIRED)
    private String donorWallet;
}
