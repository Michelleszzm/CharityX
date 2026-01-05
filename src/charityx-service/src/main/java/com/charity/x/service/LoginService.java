package com.charity.x.service;

import com.charity.x.dto.request.CodeLoginRequest;
import com.charity.x.dto.request.LoginRequest;
import com.charity.x.dto.request.RestPasswordConfirmRequest;
import com.charity.x.dto.request.SendEmailCodeRequest;
import com.charity.x.dto.response.LoginResponse;
import com.charity.x.dto.vo.SysUserVo;

/**
 * @Author: Lucass @Date: 2025/11/6 11:39 @Description:
 */
public interface LoginService {

    /**
     * Send email verification code
     * @param request
     * @return
     */
    Boolean sendEmailCode(SendEmailCodeRequest request);

    /**
     * Login
     * @param request
     * @return
     */
    LoginResponse login(LoginRequest request);

    /**
     * OAuth login
     * @param sysUserVo
     * @return
     */
    String oAuthLogin(SysUserVo sysUserVo);

    /**
     * Password reset verification code verification
     * @param request
     * @return
     */
    String resetPasswordCodeVerify(CodeLoginRequest request);

    /**
     * Password reset
     * @param request
     * @return
     */
    Boolean resetPasswordConfirm(RestPasswordConfirmRequest request);
}
