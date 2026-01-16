package com.charity.x.service.manager;


import com.charity.x.config.S3Config;
import com.charity.x.dto.ResultCode;
import com.charity.x.dto.request.AwsS3PreSignedUrlRequest;
import com.charity.x.dto.response.AwsS3PreSignedUrlResponse;
import com.charity.x.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestTemplate;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import org.springframework.http.*;

import java.net.URI;
import java.net.URL;
import java.time.Duration;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * @Author: Lucass
 * @CreateTime: 2025-11-28
 * @Description:
 * @Version: 1.0
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AwsS3Manager {
    private final S3Presigner s3Presigner;
    private final S3Config s3Config;
    private final RestTemplate restTemplate;

    public AwsS3PreSignedUrlResponse uploadFile(AwsS3PreSignedUrlRequest request, byte[] fileBytes) {
        AwsS3PreSignedUrlResponse result = generatePreSignedUrl(request);
        log.info("uploadFile,fileSize={},preInfo:{}", fileBytes.length, result);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.parseMediaType(request.getContentType()));
        headers.setContentLength(fileBytes.length);

        HttpEntity<byte[]> requestEntity = new HttpEntity<>(fileBytes, headers);
        URI uri;
        try {
            uri = new URI(result.getUrl());
        } catch (Exception e) {
            log.error("File upload failed: failed to construct URI from url: url={}", result.getUrl(), e);
            throw new BusinessException(ResultCode.BUSINESS_FILE_UPLOAD_ERROR.getCode(), "build URI by preUrl error");
        }
        ResponseEntity<String> response = restTemplate.exchange(
                uri,
                HttpMethod.PUT,
                requestEntity,
                String.class
        );
        if (!response.getStatusCode().is2xxSuccessful()) {
            log.error("File upload failed: {},response={}", request, response);
            throw new BusinessException(ResultCode.BUSINESS_FILE_UPLOAD_ERROR);
        }
        return result;
    }

    public AwsS3PreSignedUrlResponse generatePreSignedUrl(AwsS3PreSignedUrlRequest request) {
        String fileName = StringUtils.hasText(request.getFileName()) ? request.getFileName() : UUID.randomUUID().toString().replace("-", "") + ".png";
        String contentType = StringUtils.hasText(request.getContentType()) ? request.getContentType() : "image/png";
        // Define upload object path, can customize folder
        String key = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM")) + "/" + fileName;

        // Create PutObject request
        PutObjectRequest objectRequest = PutObjectRequest.builder()
                .bucket(s3Config.getBucket())
                //.acl(ObjectCannedACL.PUBLIC_READ) // ✅ Public read
                .key(key)
                .contentType(contentType)
                .build();

        // Issue upload URL with expiration (default 5 minutes)
        PutObjectPresignRequest presignRequest = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(s3Config.getExpiration()))
                .putObjectRequest(objectRequest)
                .build();

        URL preSignedUrl = s3Presigner.presignPutObject(presignRequest).url();
        return AwsS3PreSignedUrlResponse.builder().url(preSignedUrl.toString()).fileUrl(s3Config.getDomain() + "/" + key).build();
    }


}
