package com.charity.x.service;

import com.charity.x.common.menu.SysRoleCodeEnum;
import com.charity.x.dto.AuthUser;
import com.charity.x.dto.vo.SysUserVo;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * @Author: Lucass @Date: 2025/11/5 16:59 @Description:
 */
//@Service
@RequiredArgsConstructor
@Deprecated
public class UserDetailsServiceImpl implements UserDetailsService {

    private final SysUserService userService;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        SysUserVo sysUserVo = userService.getUserByEmail(email);
        if (sysUserVo == null) {
            throw new UsernameNotFoundException("User does not exist: " + email);
        }

        List<String> roleCodes = sysUserVo.getRoles();
        if (CollectionUtils.isEmpty(roleCodes)){
            roleCodes = new ArrayList<>();
        }
        roleCodes.add(SysRoleCodeEnum.USER.getCode());
        roleCodes = roleCodes.stream().map(e -> "ROLE_" + e).collect(Collectors.toList());

        return new AuthUser(sysUserVo, roleCodes);
    }
}
