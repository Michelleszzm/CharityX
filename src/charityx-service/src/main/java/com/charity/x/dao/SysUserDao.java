package com.charity.x.dao;

import com.charity.x.dto.entity.SysRole;
import com.charity.x.dto.vo.SysUserVo;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;

@Mapper
public interface SysUserDao {

    int saveOne(SysUserVo sysUserVo);

    SysUserVo queryByProvider(String provider, String providerId, Integer groupUserId);

    int updateById(SysUserVo sysUserVo);

    SysUserVo getUserByEmail(String email);

    SysUserVo queryById(Integer id);

    List<SysRole> getUserRoles(Integer userId);

    List<SysUserVo> queryOnlyRegister(String email);
}
