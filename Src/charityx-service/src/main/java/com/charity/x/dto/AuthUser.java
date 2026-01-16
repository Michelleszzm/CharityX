package com.charity.x.dto;

import com.charity.x.dto.vo.SysUserVo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.oauth2.core.user.OAuth2User;

import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * @Author: Lucass @Date: 2025/11/5 16:57 @Description:
 */
@Data
public class AuthUser implements UserDetails, OAuth2User {
    private Integer userId;
    private String email;
    private List<String> roles;
    private String token;
    private Map<String, Object> attributes = new HashMap<>();

    public AuthUser() {
    }

    public AuthUser(SysUserVo user, List<String> roles) {
        this.userId = user.getId();
        this.email = user.getEmail();
        this.roles = roles;
        this.attributes.put("userId", user.getId());
        this.attributes.put("email", user.getEmail());
        this.attributes.put("roles", roles);
    }

    public AuthUser(Integer userId,String email, List<String> roles, Map<String, Object> attributes) {
        this.userId = userId;
        this.email = email;
        this.roles = roles;
        this.attributes.put("userId", userId);
        this.attributes.put("email", email);
        this.attributes.put("roles", roles);
        if (attributes != null){
            this.attributes.putAll(attributes);
        }
    }

    public AuthUser(SysUserVo user, List<String> roles,  Map<String, Object> attributes) {
        this(user, roles);
        if (attributes != null) {
            this.attributes.putAll(attributes);
        }
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return this.roles.stream()
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }

    @Override
    public String getPassword() {
        return "";
    }

    @Override
    public String getUsername() {
        return "";
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

    // OAuth2User interface methods
    @Override
    public Map<String, Object> getAttributes() {
        return this.attributes;
    }

    @Override
    public String getName() {
        return "";
    }
}
