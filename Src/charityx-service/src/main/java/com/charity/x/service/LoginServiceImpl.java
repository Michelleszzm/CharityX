package com.charity.x.service;

import com.charity.x.common.menu.*;
import com.charity.x.common.utils.CodeGenerateUtil;
import com.charity.x.common.utils.JwtUtil;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.dto.AuthUser;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.CodeLoginRequest;
import com.charity.x.dto.request.LoginRequest;
import com.charity.x.dto.request.RestPasswordConfirmRequest;
import com.charity.x.dto.request.SendEmailCodeRequest;
import com.charity.x.dto.response.LoginResponse;
import com.charity.x.dto.response.UserInfoResponse;
import com.charity.x.dto.vo.SysUserMergeVo;
import com.charity.x.dto.vo.SysUserVo;
import com.charity.x.exception.BusinessException;
import com.charity.x.service.manager.EmailManager;
import com.charity.x.service.manager.UserManager;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.concurrent.TimeUnit;

/**
 * @Author: Lucass @Date: 2025/11/6 11:41 @Description:
 */
@Slf4j
@Service
public class LoginServiceImpl implements LoginService {

    @Autowired
    private JwtUtil jwtUtil;
    @Autowired
    private EmailManager emailManager;
    @Autowired
    private RedisCacheUtil redisCacheUtil;
    @Autowired
    private SysUserService sysUserService;
    @Autowired
    private UserManager userManager;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Boolean sendEmailCode(SendEmailCodeRequest request) {
        // Query user information
        SysUserMergeVo mergeVo = sysUserService.getUserMergeByEmail(request.getEmail());
        if (Boolean.FALSE.equals(mergeVo.getCheck())) {
            throw new BusinessException(ResultCode.BUSINESS_EMAIL_DISABLE_ERROR);
        }
        String lockKey = String.format(RedisKeyEnum.SEND_EMAIL_CODE_LOCK.getKeyExpression(), request.getEmail());
        if (redisCacheUtil.setIfAbsent(lockKey, LocalDateTime.now().toString(), RedisKeyEnum.SEND_EMAIL_CODE_LOCK.getExpire(), TimeUnit.SECONDS)) {
            String code = CodeGenerateUtil.randomNumberCode(6);
            String key = String.format(RedisKeyEnum.EMAIL_CODE.getKeyExpression(), request.getEmail());
            redisCacheUtil.set(key, code, RedisKeyEnum.EMAIL_CODE.getExpire(), TimeUnit.SECONDS);
            emailManager.asyncSendSceneCodeEmail(EmailSendSceneEnum.getByScene(request.getScene()), request.getEmail(), code);
            return Boolean.TRUE;
        }
        throw new BusinessException(ResultCode.BUSINESS_SEND_EMAIL_CODE_LIMIT_ERROR);
    }

    @Override
    @Transactional(rollbackFor = Exception.class, timeout = 5)
    public LoginResponse login(LoginRequest request) {
        // Query user information
        SysUserMergeVo mergeVo = sysUserService.getUserMergeByEmail(request.getEmail());
        if (Boolean.FALSE.equals(mergeVo.getCheck())) {
            throw new BusinessException(ResultCode.BUSINESS_EMAIL_DISABLE_ERROR);
        }
        SysUserVo sysUserVo = mergeVo.getSysUserVo();
        if (request.getType() == LoginTypeEnum.CODE.getType()) {
            Boolean codeCheck = checkCode(request.getEmail(), request.getCode());
            if (Boolean.FALSE.equals(codeCheck)) {
                throw new BusinessException(ResultCode.BUSINESS_EMAIL_CODE_INVALID_ERROR);
            }
            if (sysUserVo == null) {
                // Add new user
                sysUserVo = new SysUserVo();
                sysUserVo.setEmail(request.getEmail());
                sysUserVo.setProvider(SysUserProviderEnum.EMAIL.getProvider());
                sysUserVo.setProviderId(request.getEmail());
                sysUserService.save(sysUserVo);
            }
        } else {
            if (sysUserVo == null) {
                throw new BusinessException(ResultCode.BUSINESS_EMAIL_PASSWORD_INVALID_ERROR);
            }
            if (!passwordEncoder.matches(request.getPassword(), sysUserVo.getPassword())) {
                throw new BusinessException(ResultCode.BUSINESS_EMAIL_PASSWORD_INVALID_ERROR);
            }
        }
        if (sysUserVo.getRoles() == null) {
            sysUserVo.setRoles(new ArrayList<>());
        }
        sysUserVo.getRoles().add(SysRoleCodeEnum.getRoleCodeWithPrefix(SysRoleCodeEnum.USER));
        sysUserVo.setStatus(StatusEnum.ENABLED.getStatus());
        AuthUser authUser = new AuthUser(sysUserVo, sysUserVo.getRoles(), null);
        String token = jwtUtil.generateTokenWithToRedis(authUser);
        UserInfoResponse info = userManager.userInfo(sysUserVo.getId());
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setSysUserVo(info.getSysUserVo());
        response.setCharityNonprofitMergeVo(info.getCharityNonprofitMergeVo());
        return response;
    }

    @Override
    public String oAuthLogin(SysUserVo sysUserVo) {
        SysUserProviderEnum provider = SysUserProviderEnum.getByProvider(sysUserVo.getProvider());
        if (provider != null) {
            SysUserVo dbExistVo = sysUserService.queryByProvider(sysUserVo.getProvider(), sysUserVo.getProviderId(), null);
            if (dbExistVo == null) {
                // Add new user
                sysUserService.save(sysUserVo);
            } else {
                sysUserVo = dbExistVo;
            }
            SysUserVo sysuserVo = sysUserService.getUserWithRolesById(sysUserVo.getId());
            return jwtUtil.generateTokenWithToRedis(new AuthUser(sysuserVo.getId(), sysUserVo.getEmail(), sysuserVo.getRoles(), null));
        }
        return null;
    }

    @Override
    public String resetPasswordCodeVerify(CodeLoginRequest request) {
        Boolean codeCheck = checkCode(request.getEmail(), request.getCode());
        if (Boolean.TRUE.equals(codeCheck)) {
            String token = CodeGenerateUtil.randomCode(16);
            String key = String.format(RedisKeyEnum.RESET_PASSWORD_TOKEN.getKeyExpression(), request.getEmail());
            redisCacheUtil.set(key, token, RedisKeyEnum.RESET_PASSWORD_TOKEN.getExpire(), TimeUnit.SECONDS);
            return token;
        }
        throw new BusinessException(ResultCode.BUSINESS_EMAIL_CODE_INVALID_ERROR);
    }

    @Override
    public Boolean resetPasswordConfirm(RestPasswordConfirmRequest request) {
        String key = String.format(RedisKeyEnum.RESET_PASSWORD_TOKEN.getKeyExpression(), request.getEmail());
        String token = redisCacheUtil.get(key);
        if (request.getToken().equals(token)) {
            redisCacheUtil.delete(key);
            request.validate();
            SysUserVo sysUserVo = sysUserService.queryByProvider(SysUserProviderEnum.EMAIL.getProvider(), request.getEmail(), null);
            if (sysUserVo == null) {
                throw new BusinessException(ResultCode.BUSINESS_EMAIL_IS_NOT_REGISTERED_ERROR);
            }
            SysUserVo update = new SysUserVo();
            update.setId(sysUserVo.getId());
            update.setPassword(passwordEncoder.encode(request.getPassword()));
            int row = sysUserService.updateById(update);
            return row > 0;
        }
        throw new BusinessException(ResultCode.BUSINESS_EMAIL_CODE_INVALID_ERROR);
    }


    private Boolean checkCode(String email, String code) {
        String key = String.format(RedisKeyEnum.EMAIL_CODE.getKeyExpression(), email);
        String cacheCode = redisCacheUtil.get(key);
        redisCacheUtil.delete(key);
        return cacheCode != null && cacheCode.equals(code);
    }
}
