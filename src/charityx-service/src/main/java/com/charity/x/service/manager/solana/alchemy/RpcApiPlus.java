package com.charity.x.service.manager.solana.alchemy;

import org.p2p.solanaj.rpc.RpcApi;
import org.p2p.solanaj.rpc.RpcException;

import java.util.*;

public class RpcApiPlus extends RpcApi {
    private RpcClientPlus client;

    public RpcApiPlus(RpcClientPlus client) {
        super(client);
        this.client = client;
    }

    @SuppressWarnings("unchecked")
    private <T> T callWithGenericType(String method, List<Object> params, Class<?> rawClass) throws RpcException {
        return (T) client.call(method, params, rawClass);
    }

    public ConfirmedTransactionPlus getTransaction(String signature, Map<String, Object> paramMap) throws RpcException {
        List<Object> params = new ArrayList<>();
        params.add(signature);
        Map<String, Object> parameterMap = new HashMap<>();

        if (paramMap != null) {
            parameterMap.putAll(paramMap);
        }
        params.add(parameterMap);
        return client.call("getTransaction", params, ConfirmedTransactionPlus.class);
    }
}
