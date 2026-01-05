package com.charity.x.dto.response;

import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/8 14:14 @Description:
 */
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AwsS3PreSignedUrlResponse {

    private String url;

    private String fileUrl;
}
