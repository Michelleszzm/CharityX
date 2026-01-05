package com.charity.x.dto.vo;

import java.io.Serial;
import java.io.Serializable;
import java.util.List;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/6 19:51 @Description:
 */
@Data
public class CharityNonprofitFundraisingConfigPayment implements Serializable {
    @Serial
    private static final long serialVersionUID = -7325823689936517965L;

    @NotEmpty.List(@NotEmpty(message = "chain for payment can not empty"))
    private List<String> chainList;

    @NotEmpty.List(@NotEmpty(message = "token for payment can not empty"))
    private List<String> tokenList;

    @NotEmpty.List(@NotEmpty(message = "wallet address for receiving donations can not empty"))
    @Valid
    private List<ChainWallet> chainWalletList;

    @Data
    public static class ChainWallet {

        @NotEmpty(message = "chain for wallet can not empty")
        private String chain;

        @NotEmpty(message = "wallet address for wallet can not empty")
        private String wallet;
    }
}
