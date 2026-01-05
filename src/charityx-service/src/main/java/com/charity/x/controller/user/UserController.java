package com.charity.x.controller.user;

import com.charity.x.common.menu.RedisKeyEnum;
import com.charity.x.common.utils.RedisCacheUtil;
import com.charity.x.controller.BaseController;
import com.charity.x.dto.Result;
import com.charity.x.dto.request.StartYourFundraisingRequest;
import com.charity.x.dto.response.UserInfoResponse;
import com.charity.x.service.manager.UserManager;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: Lucass @Date: 2025/11/10 11:30 @Description:
 */
@Slf4j
@RestController
@RequestMapping("/user")
@Tag(name = "2.User Related Endpoints", description = "Fundraising Reports Endpoints")
public class UserController extends BaseController {

    @Autowired
    private ObjectMapper objectMapper;
    @Autowired
    private UserManager userManager;
    @Autowired
    private RedisCacheUtil redisCacheUtil;

    @GetMapping("/info")
    @Operation(summary = "User information query",description = "User information query")
    public Result<UserInfoResponse> userInfo() {
        return Result.success(userManager.userInfo(getUserIdWithCheckLogin()));
    }

    @PostMapping("/complete")
    @Operation(summary = "Complete user information",description = "Complete user information")
    public Result<Boolean> completeUserInfo(@Validated @RequestBody StartYourFundraisingRequest request) {
        request.setUserId(getUserIdWithCheckLogin());
        return Result.success(userManager.completeUserWithNonprofit(request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Logout")
    public Result<Boolean> logout() throws JsonProcessingException {
        redisCacheUtil.delete(String.format(RedisKeyEnum.JWT_TOKEN.getKeyExpression(), getUserLoginToken()));
        log.info("User logged out:{}",objectMapper.writeValueAsString(getUser()));
        return Result.success(true);
    }
}
