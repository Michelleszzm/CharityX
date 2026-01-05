package service.manager;

import com.charity.x.Application;
import com.charity.x.common.menu.ChainEnum;
import com.charity.x.dto.response.DonationRecordResponse;
import com.charity.x.service.manager.AlchemyApiManager;
import com.charity.x.service.manager.solana.alchemy.ConfirmedTransactionPlus;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.junit.jupiter.api.Test;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/10 21:05 @Description:
 */
@Slf4j
@SpringBootTest(classes = Application.class)
public class AlchemyApiManagerTest {
    @Autowired
    private AlchemyApiManager alchemyApiManager;
    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void getTransactionWithCache() {
        //Transfer USDC
        //String txHash = "3dkamZxZM9ZQmJJUuzHEfpf98S88BdvZviEhE13cRJDp7DZuXonY9WwkR4uWeyQig1f6JeGGeWcffDZtFHCyLQVR";
        //Non-transfer
        //String txHash = "XqSzSFEupukQ7c691wCkHf8QiDXdfn4jVzrsSnGHA4ZwpNuAs8SzqRNQPCKEpzFGKxhbQW68N1tp42kR6fi9GTw";
        //SOL
        //String txHash = "5kbcRxaUMYzL74q7RvxPYwFM8AQbT2RsPMA5vwnJ5v9hzAYVx8SNXboZUnABcG72Rw3NkRRoCrgUNE2kvFZqcyRz";
        //Transfer USDT via transfer instruction
        String txHash = "5MbCKnZzDFc2LNwbGo2KeyNRfDah8wW1HSXLmBvHKi2wYxbEKVUa2MBwCcRbXDHYzARTDMwTL7P6epctTTB6Jpti";
        List<DonationRecordResponse> responseList = alchemyApiManager.getTransactionAndParseWithCache(ChainEnum.SOLANA.getChain(), txHash);
        log.info("DonationRecordResponse: {}", responseList);
    }

    @Test
    public void testGetTransaction() {
        String txHash = "3t9CP3FfZ158MLxACVbuWSLiaTNq3jmwTse4t6WWk9kFZooxJ9orqff8c3D8zvNjTvidywJiZPMfSnMKkfrEYjJ4";
        ConfirmedTransactionPlus transaction = alchemyApiManager.getTransaction(ChainEnum.SOLANA.getChain(), txHash);
        log.info("Transaction: {}", transaction);
    }

}
