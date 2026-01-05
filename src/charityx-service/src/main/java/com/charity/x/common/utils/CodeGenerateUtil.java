package com.charity.x.common.utils;

import java.util.Random;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * @Author: Lucass @Date: 2025/10/20 15:54 @Description:
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class CodeGenerateUtil {
    private static final String UPPER_CHAR_AND_NUMBER_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    private static final String UPPER_CHAR_POOL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String NUMBER_POOL = "0123456789";
    private static final String NFT_PREFIX = "NTF#";
    private static final Random RANDOM = new Random();


    public static String randomNftCode(int length) {
        return NFT_PREFIX + randomUpperCharCode(3) + randomNumberCode(length - 3);
    }

    public static String randomUpperCharCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(UPPER_CHAR_POOL.charAt(RANDOM.nextInt(UPPER_CHAR_POOL.length())));
        }
        return sb.toString();
    }

    public static String randomNumberCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(NUMBER_POOL.charAt(RANDOM.nextInt(NUMBER_POOL.length())));
        }
        return sb.toString();
    }

    public static String randomCode(int length) {
        StringBuilder sb = new StringBuilder(length);
        for (int i = 0; i < length; i++) {
            sb.append(UPPER_CHAR_AND_NUMBER_POOL.charAt(RANDOM.nextInt(UPPER_CHAR_AND_NUMBER_POOL.length())));
        }
        return sb.toString();
    }

    public static void main(String[] args){
        for(int i = 0; i < 100; i++) {
            System.out.println(randomNumberCode(6));
        }
    }
}
