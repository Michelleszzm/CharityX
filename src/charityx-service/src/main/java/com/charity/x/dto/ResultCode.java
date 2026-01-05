package com.charity.x.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * Return status code enumeration
 */
@Getter
@AllArgsConstructor
public enum ResultCode {

    /**
     * Success
     */
    SUCCESS(200, "success"),

    /**
     * Error
     */
    ERROR(500, "Operation failed"),

    /**
     * Parameter error
     */
    PARAM_ERROR(400, "Parameter error"),

    /**
     * Unauthorized
     */
    UNAUTHORIZED(401, "Unauthorized"),

    /**
     * Forbidden
     */
    FORBIDDEN(403, "Forbidden"),

    /**
     * Resource not found
     */
    NOT_FOUND(404, "Resource not found"),

    /**
     * Method not allowed
     */
    METHOD_NOT_ALLOWED(405, "Method not allowed"),

    /**
     * System error
     */
    SYSTEM_ERROR(500, "System error"),

    /**
     * Service unavailable
     */
    SERVICE_UNAVAILABLE(503, "Service unavailable"),

    /**
     * Business error
     */
    BUSINESS_ERROR(1000, "Business error"),

    /**
     * Send verification codes frequently
     */
    BUSINESS_SEND_EMAIL_CODE_LIMIT_ERROR(1001, "Send verification codes frequently"),

    /**
     * Email disabled
     */
    BUSINESS_EMAIL_DISABLE_ERROR(1002, "Email had disabled"),

    /**
     * Email verification code invalid
     */
    BUSINESS_EMAIL_CODE_INVALID_ERROR(1003, "Verification code invalid"),

    /**
     * Email not registered
     */
    BUSINESS_EMAIL_IS_NOT_REGISTERED_ERROR(1004, "Email is not registered"),

    /**
     * Password incorrect
     */
    BUSINESS_PASSWORD_INVALID_ERROR(1005, "Password invalid"),

    BUSINESS_EMAIL_PASSWORD_INVALID_ERROR(1006, "Email or password invalid"),

    BUSINESS_OAUTH_CHANNEL_NOT_SUPPORT_ERROR(1007, "OAuth channel not support"),

    BUSINESS_FILE_UPLOAD_ERROR(1008, "file upload error"),

    BUSINESS_OPERATION_NOT_SUPPORT_ERROR(1010, "Operation not support, Please check again"),

    BUSINESS_DATA_EXPIRED_ERROR(1100, "Data expired, Please refresh and try again"),

    ;
    private final Integer code;
    private final String message;

    /**
     * Find corresponding ResultCode enum value by error code
     * @param code Error code
     * @return Corresponding ResultCode enum value, returns BUSINESS_ERROR if not found
     */
    public static ResultCode fromCode(Integer code) {
        for (ResultCode resultCode : values()) {
            if (resultCode.getCode().equals(code)) {
                return resultCode;
            }
        }
        return BUSINESS_ERROR;
    }
}
