package com.charity.x.service.manager.solana.alchemy;


import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;
import lombok.Getter;
import lombok.ToString;
import org.p2p.solanaj.rpc.types.TokenResultObjects;

import java.util.List;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-21
 * @Description:
 * @Version: 1.0
 */
@Data
@ToString(callSuper = true)
public class ConfirmedTransactionPlus {
    @Getter
    @ToString
    public static class Header {

        @JsonProperty("numReadonlySignedAccounts")
        private long numReadonlySignedAccounts;

        @JsonProperty("numReadonlyUnsignedAccounts")
        private long numReadonlyUnsignedAccounts;

        @JsonProperty("numRequiredSignatures")
        private long numRequiredSignatures;
    }

    @Getter
    @ToString
    public static class Info {

        @JsonProperty("account")
        private String account;

        @JsonProperty("mint")
        private String mint;

        @JsonProperty("source")
        private String source;

        @JsonProperty("destination")
        private String destination;

        @JsonProperty("lamports")
        private Long lamports;

        @JsonProperty("amount")
        private Long amount;

        @JsonProperty("wallet")
        private String wallet;

        @JsonProperty("tokenAmount")
        private TokenResultObjects.TokenAmountInfo tokenAmount;

    }


    @Getter
    @ToString
    public static class Parsed{

        @JsonProperty("type")
        private String type;

        @JsonProperty("info")
        private Info info;
    }

    @Getter
    @ToString
    public static class Instruction {

        @JsonProperty("parsed")
        private Parsed parsed;

        @JsonProperty("accounts")
        private List<String> accounts;

        @JsonProperty("data")
        private String data;

        @JsonProperty("programIdIndex")
        private long programIdIndex;

        @JsonProperty("program")
        private String program;

        @JsonProperty("programId")
        private String programId;
    }

    @Getter
    @ToString
    public static class AccountKey{
        @JsonProperty("pubkey")
        private String pubkey;
        @JsonProperty("signer")
        private boolean signer;

    }

    @Getter
    @ToString
    public static class Message {

        @JsonProperty("accountKeys")
        private List<AccountKey> accountKeys;

        @JsonProperty("header")
        private Header header;

        @JsonProperty("instructions")
        private List<Instruction> instructions;

        @JsonProperty("recentBlockhash")
        private String recentBlockhash;
    }

    @Getter
    @ToString
    public static class Status {

        @JsonProperty("Ok")
        private Object ok;
    }

    @Getter
    @ToString
    public static class TokenBalance {

        @JsonProperty("accountIndex")
        private Integer accountIndex;

        @JsonProperty("owner")
        private String owner;

        @JsonProperty("mint")
        private String mint;

        @JsonProperty("uiTokenAmount")
        private TokenResultObjects.TokenAmountInfo uiTokenAmount;
    }

    @Getter
    @ToString
    public static class Meta {

        @JsonProperty("err")
        private Object err;

        @JsonProperty("fee")
        private long fee;

        @JsonProperty("innerInstructions")
        private List<Object> innerInstructions;

        @JsonProperty("preTokenBalances")
        private List<TokenBalance> preTokenBalances;

        @JsonProperty("postTokenBalances")
        private List<TokenBalance> postTokenBalances;

        @JsonProperty("postBalances")
        private List<Long> postBalances;

        @JsonProperty("preBalances")
        private List<Long> preBalances;

        @JsonProperty("status")
        private Status status;
    }

    @Getter
    @ToString
    public static class Transaction {

        @JsonProperty("message")
        private Message message;

        @JsonProperty("signatures")
        private List<String> signatures;
    }

    @JsonProperty("meta")
    private Meta meta;

    @JsonProperty("slot")
    private long slot;

    @JsonProperty("transaction")
    private Transaction transaction;

    @JsonProperty("blockTime")
    private Long blockTime;

    @JsonProperty("version")
    private String version;
}
