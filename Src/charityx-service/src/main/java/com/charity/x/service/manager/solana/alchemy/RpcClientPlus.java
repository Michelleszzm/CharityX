package com.charity.x.service.manager.solana.alchemy;

import okhttp3.OkHttpClient;
import okhttp3.Protocol;

import java.util.concurrent.TimeUnit;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.DeserializationFeature;

import org.p2p.solanaj.rpc.*;

import java.util.Arrays;


/**
 * @Author: Lucass
 * @CreateTime: 2025-11-21
 * @Description:
 * @Version: 1.0
 */
public class RpcClientPlus extends RpcClient {
    private OkHttpClient httpClient;
    private RpcApiPlus rpcApi;
    private WeightedCluster cluster;
    private final ObjectMapper objectMapper; // Reuse ObjectMapper instance


    /**
     * Creates a configured OkHttpClient builder with gzip compression and HTTP/2 enabled.
     *
     * @return OkHttpClient.Builder with optimized settings
     */
    private static OkHttpClient.Builder createOptimizedClientBuilder() {
        return new OkHttpClient.Builder()
                .protocols(Arrays.asList(Protocol.HTTP_2, Protocol.HTTP_1_1));
        // Note: OkHttp automatically handles gzip response decompression when Accept-Encoding header is added
    }

    /**
     * Constructs an RpcClient with a specified cluster.
     *
     * @param endpoint the cluster endpoint
     */
    public RpcClientPlus(Cluster endpoint) {
        this(endpoint.getEndpoint());
    }

    /**
     * Constructs an RpcClient with a specified endpoint.
     *
     * @param endpoint the RPC endpoint
     */
    public RpcClientPlus(String endpoint) {
        this(endpoint, createOptimizedClientBuilder().readTimeout(20, TimeUnit.SECONDS).build());
    }

    /**
     * Constructs an RpcClient with a specified endpoint and timeout.
     *
     * @param endpoint the RPC endpoint
     * @param timeout  the read timeout in seconds
     */
    public RpcClientPlus(String endpoint, int timeout) {
        this(endpoint, createOptimizedClientBuilder().readTimeout(timeout, TimeUnit.SECONDS).build());
    }

    /**
     * Constructs an RpcClient with a specified endpoint and OkHttpClient.
     *
     * @param endpoint   the RPC endpoint
     * @param httpClient the OkHttpClient to use for requests
     */
    public RpcClientPlus(String endpoint, OkHttpClient httpClient) {
        super(endpoint);
        this.httpClient = httpClient;
        this.rpcApi = new RpcApiPlus(this);
        this.objectMapper = new ObjectMapper()
                .configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
                .configure(DeserializationFeature.USE_BIG_DECIMAL_FOR_FLOATS, true); // Initialize ObjectMapper
    }

    /**
     * Returns the RpcApi instance associated with this client.
     *
     * @return the RpcApi instance
     */
    @Override
    public RpcApiPlus getApi() {
        return rpcApi;
    }
}
