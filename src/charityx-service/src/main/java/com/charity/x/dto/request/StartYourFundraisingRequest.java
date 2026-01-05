package com.charity.x.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.Size;
import lombok.Data;

/**
 * @Author: Lucass @Date: 2025/11/10 13:12 @Description:
 */
@Data
public class StartYourFundraisingRequest {

    private Integer userId;

    @NotEmpty(message = "firstName cannot be empty")
    private String firstName;

    @NotEmpty(message = "lastName cannot be empty")
    private String lastName;

    @NotEmpty(message = "nonprofit name cannot be empty")
    @Size(max = 70, message = "nonprofit name cannot be longer than 70 characters")
    private String nonprofitName;

    @NotEmpty(message = "proof cannot be empty")
    private String proofImage;

    private String password;

}
