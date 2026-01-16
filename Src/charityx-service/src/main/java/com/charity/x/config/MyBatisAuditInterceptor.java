package com.charity.x.config;

import org.apache.ibatis.executor.Executor;
import org.apache.ibatis.mapping.MappedStatement;
import org.apache.ibatis.plugin.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.Properties;

/**
 * @Author: Lucass @Date: 2025/11/8 15:33 @Description:
 */
@Component
@Intercepts(@Signature(type = Executor.class, method = "update", args = {MappedStatement.class, Object.class}))
public class MyBatisAuditInterceptor implements Interceptor {

    @Override
    public Object intercept(Invocation invocation) throws Throwable {
        String method = invocation.getMethod().getName();
        Object param = invocation.getArgs()[1];

        if ("update".equals(method) && param != null) {
            fillAuditFields(param);
        }

        return invocation.proceed();
    }

    private void fillAuditFields(Object param) {
        try {
            // Get current logged-in user
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String username = authentication != null ? authentication.getName() : "system";

            LocalDateTime now = LocalDateTime.now();

            // Fill fields using reflection
            var clazz = param.getClass();

            if (hasField(clazz, "createBy") && getFieldValue(param, "createBy") == null) {
                setFieldValue(param, "createBy", username);
            }
            if (hasField(clazz, "createTime") && getFieldValue(param, "createTime") == null) {
                setFieldValue(param, "createTime", now);
            }

            // Update updateBy and updateTime on every update
            if (hasField(clazz, "updateBy")) {
                setFieldValue(param, "updateBy", username);
            }
            if (hasField(clazz, "updateTime")) {
                setFieldValue(param, "updateTime", now);
            }

        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    private boolean hasField(Class<?> clazz, String name) {
        try {
            clazz.getDeclaredField(name);
            return true;
        } catch (NoSuchFieldException e) {
            return false;
        }
    }

    private Object getFieldValue(Object obj, String field) throws Exception {
        var f = obj.getClass().getDeclaredField(field);
        f.setAccessible(true);
        return f.get(obj);
    }

    private void setFieldValue(Object obj, String field, Object value) throws Exception {
        var f = obj.getClass().getDeclaredField(field);
        f.setAccessible(true);
        f.set(obj, value);
    }

    @Override
    public Object plugin(Object target) {
        return Plugin.wrap(target, this);
    }

    @Override
    public void setProperties(Properties properties) {}
}

