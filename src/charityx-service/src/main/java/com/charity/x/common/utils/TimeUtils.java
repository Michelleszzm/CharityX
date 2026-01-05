package com.charity.x.common.utils;

import java.time.Instant;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-21
 * @Description: Time utility class
 * @Version: 1.0
 */
public final class TimeUtils {

    /**
     * System default timezone
     */
    private static final ZoneId SYSTEM_ZONE = ZoneId.systemDefault();

    /**
     * Convert seconds timestamp to LocalDateTime
     *
     * @param seconds Seconds timestamp
     * @return LocalDateTime
     */
    public static LocalDateTime secondsToLocalDateTime(long seconds) {
        Instant instant = Instant.ofEpochSecond(seconds);
        return LocalDateTime.ofInstant(instant, SYSTEM_ZONE);
    }

    /**
     * Convert milliseconds timestamp to LocalDateTime
     *
     * @param millis Milliseconds timestamp
     * @return LocalDateTime
     */
    public static LocalDateTime millisToLocalDateTime(long millis) {
        Instant instant = Instant.ofEpochMilli(millis);
        return LocalDateTime.ofInstant(instant, SYSTEM_ZONE);
    }

    /**
     * Convert seconds timestamp to LocalDate
     *
     * @param seconds Seconds timestamp
     * @return LocalDate
     */
    public static LocalDate secondsToLocalDate(long seconds) {
        return secondsToLocalDateTime(seconds).toLocalDate();
    }

    /**
     * Convert milliseconds timestamp to LocalDate
     *
     * @param millis Milliseconds timestamp
     * @return LocalDate
     */
    public static LocalDate millisToLocalDate(long millis) {
        return millisToLocalDateTime(millis).toLocalDate();
    }
}
