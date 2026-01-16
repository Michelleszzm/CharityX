package com.charity.x.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * @Author: Lucass @Date: 2025/11/5 14:58 @Description:
 */
@RestController
public class HealthController {

    @GetMapping("/health-check")
    public String health(){
        return "ok";
    }
}
