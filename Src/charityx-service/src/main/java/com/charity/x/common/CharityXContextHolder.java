package com.charity.x.common;

import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/8 16:16 @Description:
 */
public class CharityXContextHolder {

    private static final ThreadLocal<Info> INFO_THREAD_LOCAL = new ThreadLocal();

    private static void setInfo(Info info) {
        INFO_THREAD_LOCAL.set(info);
    }

    private static Info getInfo() {
        return INFO_THREAD_LOCAL.get();
    }

    public static void setRole(String role) {
        check();
        INFO_THREAD_LOCAL.get().setRole(role);
    }

    public static String getRole() {
        check();
        return INFO_THREAD_LOCAL.get().getRole();
    }

    public static void setUserId(Integer userId) {
        check();
        INFO_THREAD_LOCAL.get().setUserId(userId);
    }

    public static Integer getUserId() {
        check();
        return INFO_THREAD_LOCAL.get().getUserId();
    }

    public static void setSite(String site) {
        check();
        INFO_THREAD_LOCAL.get().setSite(site);
    }

    public static String getSite() {
        check();
        return INFO_THREAD_LOCAL.get().getSite();
    }

    public static void clear() {
        INFO_THREAD_LOCAL.remove();
    }

    @Data
    public static class Info {
        private String role;

        private Integer userId;

        private String site;
    }

    private static void check(){
        Info info =getInfo();
        if (info == null){
            setInfo(new Info());
        }
    }
}
