package com.charity.x.controller.user;

import com.charity.x.common.menu.LoginTypeEnum;
import com.charity.x.common.menu.SysUserProviderEnum;
import com.charity.x.dto.Result;
import com.charity.x.dto.request.*;
import com.charity.x.dto.response.LoginResponse;
import com.charity.x.service.LoginService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * @Author: Lucass @Date: 2025/11/6 10:14 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/unAuth")
@Tag(name = "1.User Login", description = "User Login Endpoints")
public class LoginController {
    @Autowired
    private LoginService loginService;

    @GetMapping("/oAuth")
    @Operation(summary = "Get OAuth authorization address",description = "Get OAuth authorization address")
    public Result<Map<String,String>> oAuth() {
        HashMap<String, String> map = new HashMap<>();
        map.put(SysUserProviderEnum.GOOGLE.getProvider(),"/unAuth/oauth2/authorize/google");
        return Result.success(map);
    }

    @PostMapping("/send")
    @Operation(summary = "1.Get email verification code",description = "No login required")
    public Result<Boolean> sendEmailCode(@Validated @RequestBody SendEmailCodeRequest request) {
        return Result.success(loginService.sendEmailCode(request));
    }
    @PostMapping("/codeLogin")
    @Operation(summary = "2.Verification code login")
    public Result<LoginResponse> login(@Validated @RequestBody CodeLoginRequest request) {
        LoginRequest build = LoginRequest.builder().type(LoginTypeEnum.CODE.getType()).code(request.getCode()).build();
        build.setEmail(request.getEmail());
        return Result.success(loginService.login(build));
    }
    @PostMapping("/passwordLogin")
    @Operation(summary = "3.Password login")
    public Result<LoginResponse> login(@Validated @RequestBody PasswordLoginRequest request) {
        LoginRequest build = LoginRequest.builder().type(LoginTypeEnum.PASSWORD.getType()).password(request.getPassword()).build();
        build.setEmail(request.getEmail());
        return Result.success(loginService.login(build));
    }

    @PostMapping("/resetPasswrd/code")
    @Operation(summary = "3.Password login")
    public Result<String> resetPasswrdVerify(@Validated @RequestBody CodeLoginRequest request) {
        return Result.success(loginService.resetPasswordCodeVerify(request));
    }

    @PostMapping("/resetPasswrd/confirm")
    @Operation(summary = "3.Password login")
    public Result<Boolean> resetPasswrdConfirm(@Validated @RequestBody RestPasswordConfirmRequest request) {
        return Result.success(loginService.resetPasswordConfirm(request));
    }
}
