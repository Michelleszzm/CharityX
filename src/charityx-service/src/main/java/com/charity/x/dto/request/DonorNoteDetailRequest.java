package com.charity.x.dto.request;


import com.charity.x.dto.vo.CharityDonorNoteVo;
import io.github.linpeilie.annotations.AutoMapper;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-19
 * @Description:
 * @Version: 1.0
 */
@Data
@AutoMapper(target = CharityDonorNoteVo.class)
public class DonorNoteDetailRequest {

    @NotNull(message = "chain can not empty")
    @Schema(description = "Chain", allowableValues = { "SOLANA", "BITCOIN", "ETHEREUM"},example = "SOLANA",requiredMode = Schema.RequiredMode.REQUIRED)
    private String chain;

    @NotNull(message = "wallet can not empty")
    @Schema(description = "Wallet address",requiredMode = Schema.RequiredMode.REQUIRED,example = "TEST-2025-11-19-WWWWWWWW-9")
    private String wallet;

    @NotNull(message = "note can not empty")
    @Schema(description = "Note",requiredMode = Schema.RequiredMode.REQUIRED,example = "This is a test note")
    private String note;
}
