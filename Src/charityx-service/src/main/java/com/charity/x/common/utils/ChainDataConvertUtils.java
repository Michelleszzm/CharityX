package com.charity.x.common.utils;


import com.charity.x.common.menu.ChainEnum;
import com.charity.x.common.menu.ChainTransTypeEnum;
import com.charity.x.common.menu.PayStatusEnum;
import com.charity.x.common.menu.TokenEnum;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.service.manager.solana.alchemy.ConfirmedTransactionPlus;
import io.jsonwebtoken.lang.Collections;
import lombok.extern.slf4j.Slf4j;
import org.jetbrains.annotations.NotNull;
import org.springframework.util.CollectionUtils;

import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-20
 * @Description: On-chain data conversion utility class
 * @Version: 1.0
 */
@Slf4j
public final class ChainDataConvertUtils {

    /**
     * System Program ID for Solana native transfers
     */
    private static final String SYSTEM_PROGRAM_ID = "11111111111111111111111111111111";

    /**
     * SPL Token Program ID
     */
    private static final String TOKEN_PROGRAM_ID = "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";

    /**
     * SPL Token 2022 Program ID
     */
    private static final String TOKEN_2022_PROGRAM_ID = "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb";

    /**
     * SPL Token programID
     */
    private static final List<String> TOKEN_TRANSFER_PROGRAM_IDS = List.of(SYSTEM_PROGRAM_ID, TOKEN_PROGRAM_ID, TOKEN_2022_PROGRAM_ID);

    private static final String SYSTEM_TRANS_TYPE = "transfer";

    private static final String TOKEN_TRANS_TYPE_TRANSFER = "transferChecked";

    /**
     * SPL Token transfer instruction
     */
    private static final List<String> TOKEN_TRANS_TYPE = List.of(TOKEN_TRANS_TYPE_TRANSFER, SYSTEM_TRANS_TYPE);
    private static final Long LAMPERS_PER_SOL = 1000000000L;


    /**
     * Get token type based on mint address
     * Supported tokens: SOL, WSOL, USDC, USDT
     * Other tokens return mint address
     */
    public static String getTokenByMint(ChainEnum chainEnum, String mint) {
        if (mint == null || mint.isEmpty()) {
            return mint;
        }

        return switch (chainEnum) {
            case SOLANA ->
                // SOL native token (transferred via System Program, no mint)
                    switch (mint) {
                        case "SOL" -> TokenEnum.SOL.getToken();

                        // WSOL (Wrapped SOL) - Note: WSOL mint address is different from native SOL
                        case "So11111111111111111111111111111111111111112" -> "WSOL";

                        // USDC
                        case "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" -> TokenEnum.USDC.getToken();

                        // USDT
                        case "Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB" -> TokenEnum.USDT.getToken();
                        default ->
                            // Other tokens return mint address
                                mint;
                    };
            default -> mint;
        };
    }

    /**
     * Parse Solana transaction
     * Only supports pure transfer transactions (direct wallet-to-wallet transfers)
     * - SOL native transfer: System Program Transfer instruction
     * - SPL Token transfer: Token Program Transfer instruction
     * Excludes: token trading, liquidity pool operations and other complex transactions
     * If a transaction contains multiple transfers, returns multiple response objects
     * If not a transfer transaction, returns a list containing one OTHER type response
     *
     * @param confirmedTransaction Confirmed Solana transaction
     * @return Donation record response list, returns empty list if transaction failed
     * Example:
     * ConfirmedTransactionPlus(super=ConfirmedTransaction(meta=ConfirmedTransaction.Meta(err=null, fee=5000, innerInstructions=[], preTokenBalances=[], postTokenBalances=[], postBalances=[8907787782, 7790941239, 1], preBalances=[15307792782, 1390941239, 1], status=ConfirmedTransaction.Status(ok=null)), slot=361295795, transaction=ConfirmedTransaction.Transaction(message=ConfirmedTransaction.Message(accountKeys=[7iW5tkdAnR3LjoEkxqmFTxeuCYNhMmsaKcqGKEPFoNEb, 64aPpo4Rp8tkhB22qTo1wGuBhSA8wFwzc7RBbJCc6WS, 11111111111111111111111111111111], header=ConfirmedTransaction.Header(numReadonlySignedAccounts=0, numReadonlyUnsignedAccounts=1, numRequiredSignatures=1), instructions=[ConfirmedTransaction.Instruction(accounts=[0, 1], data=3Bxs3zu6xEF8Kp8F, programIdIndex=2)], recentBlockhash=CcQa4wFWCy69FK7LbzTdr9JuC2knQ6JVxVA8hj6GC3T), signatures=[3t9CP3FfZ158MLxACVbuWSLiaTNq3jmwTse4t6WWk9kFZooxJ9orqff8c3D8zvNjTvidywJiZPMfSnMKkfrEYjJ4], blocktime=null)), blockTime=1755684450, version=legacy)
     */
    public static List<DonationRecordResponse> convertChainTxHashData(ConfirmedTransactionPlus confirmedTransaction) {
        List<DonationRecordResponse> responses = new ArrayList<>();
        if (confirmedTransaction == null){
            return responses;
        }
        ConfirmedTransactionPlus.Transaction transaction = confirmedTransaction.getTransaction();
        if (transaction == null || Collections.isEmpty(transaction.getSignatures())) {
            log.warn("Transaction is null :{}", confirmedTransaction);
            return responses;
        }
        // Get common information
        String txHash = transaction.getSignatures().get(0);
        LocalDateTime payTime = TimeUtils.secondsToLocalDateTime(confirmedTransaction.getBlockTime());

        // Check if transaction succeeded
        ConfirmedTransactionPlus.Meta meta = confirmedTransaction.getMeta();
        if (meta.getErr() != null) {
            responses.add(DonationRecordResponse.builder()
                    .chain(ChainEnum.SOLANA.getChain())
                    .transType(ChainTransTypeEnum.OTHER)
                    .txHash(txHash)
                    .payStatus(PayStatusEnum.CHAIN_ERROR.getStatus())
                    .payTime(payTime)
                    .day(payTime.toLocalDate())
                    .error(meta.getErr().toString())
                    .build());
            return responses;
        }
        // Query instructions
        buildResponseByParseInstruction(confirmedTransaction, transaction, responses, payTime, txHash);

        // Non-transfer transaction
        addDefaultNoteTransTypeResponseIfAbsent(responses, payTime, txHash);

        // Merge
        responses = mergeDonationRecordResponses(responses);

        return responses;
    }

    private static void buildResponseByParseInstruction(ConfirmedTransactionPlus confirmedTransaction, ConfirmedTransactionPlus.Transaction transaction, List<DonationRecordResponse> responses, LocalDateTime payTime, String txHash) {
        List<ConfirmedTransactionPlus.Instruction> instructions = transaction.getMessage().getInstructions();
        if (!CollectionUtils.isEmpty(instructions)) {
            HashMap<String, ConfirmedTransactionPlus.TokenBalance> tokenAccountToWalletMap = new HashMap<>(8);
            List<ConfirmedTransactionPlus.AccountKey> accountKeys = transaction.getMessage().getAccountKeys();
            List<ConfirmedTransactionPlus.TokenBalance> tokenBalanceList = new ArrayList<>();
            if (!CollectionUtils.isEmpty(confirmedTransaction.getMeta().getPostTokenBalances())) {
                tokenBalanceList.addAll(confirmedTransaction.getMeta().getPostTokenBalances());
            }
            if (!CollectionUtils.isEmpty(confirmedTransaction.getMeta().getPreTokenBalances())) {
                tokenBalanceList.addAll(confirmedTransaction.getMeta().getPreTokenBalances());
            }
            if (!CollectionUtils.isEmpty(tokenBalanceList)) {
                for (ConfirmedTransactionPlus.TokenBalance tokenBalance : tokenBalanceList) {
                    Integer accountIndex = tokenBalance.getAccountIndex();
                    String tokenAccount = accountKeys.get(accountIndex).getPubkey();
                    tokenAccountToWalletMap.put(tokenAccount, tokenBalance);
                }
            }
            for (ConfirmedTransactionPlus.Instruction instruction : instructions) {
                if (TOKEN_TRANSFER_PROGRAM_IDS.contains(instruction.getProgramId())) {
                    ConfirmedTransactionPlus.Parsed parsed = instruction.getParsed();
                    if (parsed != null && TOKEN_TRANS_TYPE.contains(parsed.getType())) {
                        ConfirmedTransactionPlus.Info info = parsed.getInfo();
                        BigDecimal value;
                        String donorWallet;
                        String foundationWallet;
                        String token;
                        if (SYSTEM_TRANS_TYPE.equals(parsed.getType())) {
                            if (info.getLamports() !=  null){
                                token = "SOL";
                                value = BigDecimal.valueOf(info.getLamports()).divide(BigDecimal.valueOf(LAMPERS_PER_SOL), 9, RoundingMode.HALF_UP);
                                donorWallet = info.getSource();
                                foundationWallet = info.getDestination();
                            }else {
                                String sourceAccount = info.getSource();
                                String destinationAccount = info.getDestination();
                                ConfirmedTransactionPlus.TokenBalance tokenBalance = tokenAccountToWalletMap.get(sourceAccount);
                                token = getTokenByMint(ChainEnum.SOLANA,tokenBalance.getMint());
                                value = BigDecimal.valueOf(info.getAmount()).divide(BigDecimal.valueOf(Math.pow(10,tokenBalance.getUiTokenAmount().getDecimals())), tokenBalance.getUiTokenAmount().getDecimals(), RoundingMode.HALF_UP);
                                donorWallet = tokenAccountToWalletMap.get(sourceAccount).getOwner();
                                foundationWallet = tokenAccountToWalletMap.get(destinationAccount).getOwner();
                            }
                        } else {
                            token = getTokenByMint(ChainEnum.SOLANA, info.getMint());
                            value = BigDecimal.valueOf(info.getTokenAmount().getUiAmount());
                            donorWallet = tokenAccountToWalletMap.get(info.getSource()).getOwner();
                            foundationWallet = tokenAccountToWalletMap.get(info.getDestination()).getOwner();
                        }

                        responses.add(
                                DonationRecordResponse.builder()
                                        .transType(ChainTransTypeEnum.TRANSFER)
                                        .day(payTime.toLocalDate())
                                        .chain(ChainEnum.SOLANA.getChain())
                                        .donorWallet(donorWallet)
                                        .foundationWallet(foundationWallet)
                                        .txHash(txHash)
                                        .token(token)
                                        .value(value)
                                        .payTime(payTime)
                                        .payStatus(PayStatusEnum.FINISH.getStatus())
                                        .error(PayStatusEnum.FINISH.toString())
                                        .build()
                        );
                    }
                }
            }
        }
    }

    private static void addDefaultNoteTransTypeResponseIfAbsent(List<DonationRecordResponse> responses, LocalDateTime payTime, String txHash) {
        if (responses.isEmpty()) {
            responses.add(
                    DonationRecordResponse.builder()
                            .transType(ChainTransTypeEnum.OTHER)
                            .day(payTime.toLocalDate())
                            .chain(ChainEnum.SOLANA.getChain())
                            .txHash(txHash)
                            .payTime(payTime)
                            .day(payTime.toLocalDate())
                            .payStatus(PayStatusEnum.FINISH_BUT_NOT_TRANS_TYPE.getStatus())
                            .error(PayStatusEnum.FINISH_BUT_NOT_TRANS_TYPE.toString())
                            .build()
            );
        }
    }

    @NotNull
    private static List<DonationRecordResponse> mergeDonationRecordResponses(List<DonationRecordResponse> responses) {
        if (responses.size() > 1) {
            Map<String, DonationRecordResponse> map = new HashMap<>(8);
            for (DonationRecordResponse response : responses) {
                DonationRecordResponse temp = map.get(response.getDonorWallet() + response.getFoundationWallet());
                if (temp == null) {
                    map.put(response.getDonorWallet() + response.getFoundationWallet(), response);
                } else {
                    temp.setValue(temp.getValue().add(response.getValue()));
                }
            }
            responses = new ArrayList<>(map.values());
        }
        return responses;
    }
}
