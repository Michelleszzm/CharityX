package com.charity.x.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.*;

/**
 * @Author: Lucass @Date: 2025/11/8 14:03 @Description:
 */
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Data
@ToString
public class AwsS3PreSignedUrlRequest {

    @Schema(description = "File name", example = "image")
    private String fileName;

    @Schema(description = "File type", example = "image/jpeg",defaultValue = "image/jpeg")
    private String contentType;
}
