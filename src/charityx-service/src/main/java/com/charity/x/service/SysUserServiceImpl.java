package com.charity.x.service;

import com.charity.x.common.menu.SysRoleCodeEnum;
import com.charity.x.common.menu.SysUserProviderEnum;
import com.charity.x.dao.SysUserDao;
import com.charity.x.dto.entity.SysRole;
import com.charity.x.dto.vo.SysUserMergeVo;
import com.charity.x.dto.vo.SysUserVo;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @Author: Lucass @Date: 2025/11/5 15:13 @Description:
 */
@Slf4j
@Service
public class SysUserServiceImpl implements SysUserService{

    @Autowired
    private SysUserDao dao;

    @Override
    public Boolean save(SysUserVo sysUserVo) {
        return dao.saveOne(sysUserVo) > 0;
    }

    @Override
    public SysUserMergeVo getUserMergeByEmail(String email) {
        SysUserVo sysUserVo = getUserByEmail(email);
        Boolean check = sysUserVo == null || sysUserVo.getStatus() == 1;
        return SysUserMergeVo.builder().check(check).sysUserVo(sysUserVo).build();
    }

    @Override
    public SysUserVo getUserByEmail(String email) {
        SysUserVo userByEmail = queryByProvider(SysUserProviderEnum.EMAIL.getProvider(),email,null);
        completeRoles(userByEmail);
        return userByEmail;
    }

    private void completeRoles(SysUserVo userByEmail) {
        if (userByEmail != null){
            List<SysRole> list = new ArrayList<>();
            // Set default role
            if (SysUserProviderEnum.getUserProviderList().contains(userByEmail.getProvider())) {
                SysRole defaultRole = new SysRole();
                defaultRole.setRoleCode(SysRoleCodeEnum.USER.getCode());
                list.add(defaultRole);
            }
            List<SysRole> dbRoles = dao.getUserRoles(userByEmail.getId());
            if (!CollectionUtils.isEmpty(dbRoles)){
                list.addAll(dbRoles);
            }
            userByEmail.setSysRoles(list);
            if (userByEmail.getSysRoles() != null){
                userByEmail.setRoles(userByEmail.getSysRoles().stream().map(e -> "ROLE_" + e.getRoleCode()).collect(Collectors.toList()));
            }
        }
    }

    @Override
    public SysUserVo processOAuth2User(String provider, OAuth2User oAuth2User) {
        String providerId = oAuth2User.getName();
        Map<String, Object> attributes = oAuth2User.getAttributes();

        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");
        String picture = (String) attributes.get("picture");

        // Check if the third-party user already exists
//        User user = findByProvider(provider, providerId);
//        if (user == null) {
//            // New user, create account
//            user = new User();
//            user.setUsername(generateUsername(provider, email, name));
//            user.setEmail(email);
//            user.setProvider(provider);
//            user.setProviderId(providerId);
//            user.setAvatar(picture);
//            user.setStatus(1);
//            user.setCreatedTime(LocalDateTime.now());
//            user.setUpdatedTime(LocalDateTime.now());
//
//            userMapper.insertUser(user);
//
//            // Assign default role to new user
//            userMapper.insertUserRole(user.getId(), 1L, LocalDateTime.now());
//
//            log.info("New OAuth2 user registered: {} from {}", user.getUsername(), provider);
//        } else {
//            // Update last login time
//            user.setLastLoginTime(LocalDateTime.now());
//            userMapper.updateLastLoginTime(user.getId(), LocalDateTime.now());
//            log.debug("OAuth2 user logged in: {} from {}", user.getUsername(), provider);
//        }
//
//        return user;
        return null;
    }

    @Override
    public SysUserVo queryByProvider(String provider, String providerId, Integer groupUserId) {
        return dao.queryByProvider(provider, providerId, groupUserId);
    }

    @Override
    public int updateById(SysUserVo sysUserVo) {
        return dao.updateById(sysUserVo);
    }

    @Override
    public SysUserVo getUserById(Integer id) {
        SysUserVo sysUserVo = dao.queryById(id);
        return sysUserVo;
    }

    @Override
    public SysUserVo getUserWithRolesById(Integer id) {
        SysUserVo sysUserVo = dao.queryById(id);
        completeRoles(sysUserVo);
        return sysUserVo;
    }

    @Override
    public List<SysUserVo> queryOnlyRegister(String email) {
        return dao.queryOnlyRegister(email);
    }

    private String getEmailFromAttributes(String provider, Map<String, Object> attributes) {
        switch (provider.toLowerCase()) {
            case "google":
                return (String) attributes.get("email");
            case "twitter":
                // Twitter may require additional API calls to get email
                return (String) attributes.get("email");
            default:
                return (String) attributes.get("email");
        }
    }

    private String getNameFromAttributes(String provider, Map<String, Object> attributes) {
        switch (provider.toLowerCase()) {
            case "google":
                return (String) attributes.get("name");
            case "twitter":
                return (String) attributes.get("name");
            default:
                return (String) attributes.get("name");
        }
    }

    private String getPictureFromAttributes(String provider, Map<String, Object> attributes) {
        switch (provider.toLowerCase()) {
            case "google":
                return (String) attributes.get("picture");
            case "twitter":
                return (String) attributes.get("profile_image_url");
            default:
                return (String) attributes.get("picture");
        }
    }
}
