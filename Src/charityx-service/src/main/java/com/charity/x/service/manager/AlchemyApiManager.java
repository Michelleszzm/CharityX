package com.charity.x.service.manager;

import com.charity.x.common.menu.RedisKeyEnum;
import com.charity.x.common.utils.ChainDataConvertUtils;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.manager.solana.alchemy.ConfirmedTransactionPlus;
import com.charity.x.service.manager.solana.alchemy.RpcClientPlus;
import com.fasterxml.jackson.core.type.TypeReference;
import lombok.extern.slf4j.Slf4j;
import org.p2p.solanaj.rpc.types.LatestBlockhash;
import org.p2p.solanaj.rpc.types.config.Commitment;
import org.p2p.solanaj.rpc.types.config.RpcSendTransactionConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;
import org.springframework.scheduling.annotation.Async;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.HashMap;
import java.util.List;
import java.util.concurrent.TimeUnit;

/**
 * AlchemyApiManager
 * <p> @Author: Lucass  @Date: 2025/11/10 19:50  @Description:  @link {https://www.alchemy.com/docs/node/solana/solana-api-endpoints/get-transaction?explorer=true}</p>
 */
@Slf4j
@Configuration
public class AlchemyApiManager {

    private static final String BLOCK_HASH_CACHE_KEY = "AlchemyApi:blockHash";
    private static final String ALCHEMY_SOLANA_API_ENDPOINT = "ALCHEMY_SOLANA_API_ENDPOINT";

    @Lazy
    @Autowired
    private RpcClientPlus solanaRpcClient;
    @Autowired
    private RedisCacheUtil redisCacheUtil;
    @Lazy
    @Autowired
    private AlchemyApiManager self;

    @Bean
    public RpcClientPlus solanaRpcClient() {
        return new RpcClientPlus(ALCHEMY_SOLANA_API_ENDPOINT);
    }


    public List<DonationRecordResponse> getTransactionAndParseWithCache(String chain, String txHash) {
        try {
            String key = String.format(RedisKeyEnum.CHAIN_TX_INFO.getKeyExpression(), chain, txHash);
            List<DonationRecordResponse> responseList = redisCacheUtil.get(key, new TypeReference<List<DonationRecordResponse>>() {
            });
            if (CollectionUtils.isEmpty(responseList)) {
                ConfirmedTransactionPlus transaction = getTransaction(chain, txHash);
                if (transaction != null) {
                    responseList = ChainDataConvertUtils.convertChainTxHashData(transaction);
                    if (!CollectionUtils.isEmpty(responseList)) {
                        redisCacheUtil.set(key, responseList, RedisKeyEnum.CHAIN_TX_INFO.getExpire(), TimeUnit.SECONDS);
                    }
                }
            }
            return responseList;
        } catch (Exception e) {
            log.error("Alchemy Api Failed to get transaction: ", e);
            throw new BusinessException(ResultCode.BUSINESS_ERROR.getCode(), "Alchemy Api Failed to get transaction");
        }
    }

    public ConfirmedTransactionPlus getTransaction(String chain, String txHash) {
        try {
            HashMap<String, Object> map = new HashMap<>();
            map.put("encoding", "jsonParsed");
            map.put("commitment", Commitment.CONFIRMED);
            map.put("maxSupportedTransactionVersion", 0);
            return solanaRpcClient.getApi().getTransaction(txHash, map);
        } catch (Exception e) {
            log.error("Alchemy Api Failed to get transaction: {}", e.getMessage());
            throw new BusinessException(ResultCode.BUSINESS_ERROR.getCode(), "Alchemy Api Failed to get transaction");
        }
    }

    public String sendTx(String encodeSerializedTransaction) {
        try {
            return solanaRpcClient.getApi().sendRawTransaction(encodeSerializedTransaction, new RpcSendTransactionConfig());
        } catch (Exception e) {
            log.error("Alchemy Api Failed to send transaction: {}", e.getMessage());
            throw new BusinessException(ResultCode.BUSINESS_ERROR.getCode(), "Alchemy Api Failed to send transaction");
        }
    }

    public String getLatestBlockHash() {
        String blockHash = redisCacheUtil.get(BLOCK_HASH_CACHE_KEY);
        if (StringUtils.hasText(blockHash)) {
            if (redisCacheUtil.getExpire(BLOCK_HASH_CACHE_KEY) <= 10) {
                self.asyncRefreshLatestBlockHash();
            }
        } else {
            refreshLatestBlockHash();
            blockHash = redisCacheUtil.get(BLOCK_HASH_CACHE_KEY);
        }
        return blockHash;
    }

    @Async("asyncServiceExecutor")
    public void asyncRefreshLatestBlockHash() {
        try {
            LatestBlockhash blockhash = solanaRpcClient.getApi().getLatestBlockhash();
            if (blockhash != null && StringUtils.hasText(blockhash.getValue().getBlockhash())) {
                redisCacheUtil.set(BLOCK_HASH_CACHE_KEY, blockhash.getValue().getBlockhash(), 20 * 1L, TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            log.error("Alchemy Api Failed to get recent block hash: {}", e.getMessage());
            throw new BusinessException(ResultCode.BUSINESS_ERROR.getCode(), "Alchemy Api Failed to get recent block hash");
        }
    }

    private void refreshLatestBlockHash() {
        try {
            LatestBlockhash blockhash = solanaRpcClient.getApi().getLatestBlockhash();
            if (blockhash != null && StringUtils.hasText(blockhash.getValue().getBlockhash())) {
                redisCacheUtil.set(BLOCK_HASH_CACHE_KEY, blockhash.getValue().getBlockhash(), 20 * 1L, TimeUnit.SECONDS);
            }
        } catch (Exception e) {
            log.error("Alchemy Api Failed to get recent block hash: {}", e.getMessage());
            throw new BusinessException(ResultCode.BUSINESS_ERROR.getCode(), "Alchemy Api Failed to get recent block hash");
        }
    }

}
