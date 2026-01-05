package com.charity.x.controller;

import com.charity.x.common.CharityXContextHolder;
import com.charity.x.dto.AuthUser;
import com.charity.x.dto.ResultCode;
import com.charity.x.exception.BusinessException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * @Author: Lucass @Date: 2025/11/7 13:18 @Description:
 */
@Slf4j
public abstract class BaseController {

    protected AuthUser getUser() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        if (principal instanceof AuthUser){
            return (AuthUser) principal;
        }
        return null;
    }

    protected Integer getUserIdWithCheckLogin() {
        AuthUser user = getUser();
        if (user == null){
            throw new BusinessException(ResultCode.UNAUTHORIZED);
        }
        return user.getUserId();
    }

    protected String getUserLoginToken() {
        AuthUser user = getUser();
        if (user == null){
            return null;
        }
        return user.getToken();
    }

    protected String getCustomerSite(){
        return CharityXContextHolder.getSite();
    }

    protected Integer getCustomerGroupUserIdWithCheck(){
        Integer groupUserId = getCustomerGroupUserId();
        if (groupUserId == null){
            throw new BusinessException(ResultCode.NOT_FOUND);
        }
        return groupUserId;
    }

    protected Integer getCustomerGroupUserId(){
        return CharityXContextHolder.getUserId();
    }
}
