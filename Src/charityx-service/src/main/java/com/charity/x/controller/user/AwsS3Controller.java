package com.charity.x.controller.user;

import com.charity.x.dto.Result;
import com.charity.x.dto.request.AwsS3PreSignedUrlRequest;
import com.charity.x.dto.response.AwsS3PreSignedUrlResponse;
import com.charity.x.service.manager.AwsS3Manager;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

/**
 * @Author: Lucass @Date: 2025/11/8 13:56 @Description:
 */
@RestController
@RequestMapping("/user/s3")
@RequiredArgsConstructor
@Tag(name = "AwsS3Controller", description = "AwsS3Controller")
public class AwsS3Controller {

    private final AwsS3Manager awsS3Manager;

    /**
     * Generate pre-signed URL for upload
     */
    @GetMapping("/preSigned/url")
    @Operation(summary = "Generate pre-signed URL for upload")
    public Result<AwsS3PreSignedUrlResponse> generatePreSignedUrl(AwsS3PreSignedUrlRequest request) {
        String contentType = StringUtils.hasText(request.getContentType()) ? request.getContentType() : "image/png";
        request.setContentType(contentType);
        return Result.success(awsS3Manager.generatePreSignedUrl(request));
    }
}

