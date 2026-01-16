package com.charity.x.dto.response;

import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/10 08:41 @Description:
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class LoginResponse extends UserInfoResponse {

    private String token;
}
