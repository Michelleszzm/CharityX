package com.charity.x.service;

import com.charity.x.dto.vo.SysUserMergeVo;
import com.charity.x.dto.vo.SysUserVo;
import jakarta.validation.constraints.NotNull;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.List;

/**
 * @Author: Lucass @Date: 2025/11/5 15:12 @Description:
 */
public interface SysUserService{

    Boolean save(SysUserVo sysUserVo);

    SysUserMergeVo getUserMergeByEmail(String email);

    SysUserVo getUserByEmail(String email);

    SysUserVo processOAuth2User(String provider, OAuth2User oAuth2User);

    /**
     *
     * @param provider
     * @param providerId
     * @param groupUserId
     * @return
     */
    SysUserVo queryByProvider(@NotNull String provider, @NotNull String providerId, Integer groupUserId);

    int updateById(SysUserVo sysUserVo);

    SysUserVo getUserById(Integer id);

    SysUserVo getUserWithRolesById(Integer id);

    List<SysUserVo> queryOnlyRegister(String email);
}
