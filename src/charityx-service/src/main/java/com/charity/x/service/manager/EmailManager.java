package com.charity.x.service.manager;

import com.charity.x.common.menu.EmailSendSceneEnum;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;

/**
 * @Author: Lucass @Date: 2025/11/5 21:03 @Description:
 */
@Slf4j
@Service
public class EmailManager {
    @Autowired
    private JavaMailSender mailSender;
    @Value("${spring.mail.username}")
    private String from;

    private String loadHtmlTemplate(String path) throws IOException {
        InputStream inputStream = new ClassPathResource(path).getInputStream();
        return new String(inputStream.readAllBytes(), StandardCharsets.UTF_8);
    }

    public void applicationEmail(EmailSendSceneEnum sceneEnum, String to) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        // Second parameter is display name
        helper.setFrom(from, "CharityX");
        helper.setTo(to);
        String html = switch (sceneEnum) {
            case MERGE_STATUS_ACTIVE -> {
                helper.setSubject("[CharityX] Your organization has been approved");
                yield loadHtmlTemplate("templates/application-approved.html");
            }
            case MERGE_STATUS_REVOKED -> {
                helper.setSubject("[CharityX] Your organization’s verification status has been revoked");
                yield loadHtmlTemplate("templates/application-revoked.html");
            }
            case MERGE_STATUS_REJECTED -> {
                helper.setSubject("[CharityX] Organization review result");
                yield loadHtmlTemplate("templates/application-reject.html");
            }
            default -> throw new RuntimeException("Unsupported email send scene: " + sceneEnum);
        };
        // true means HTML format
        helper.setText(html, true);
        mailSender.send(message);
    }

    public void verificationEmail(String to, String code) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        // Second parameter is display name
        helper.setFrom(from, "CharityX");
        helper.setTo(to);
        helper.setSubject("[CharityX] Your verification code");
        // Read template
        String html = loadHtmlTemplate("templates/verify-code.html");
        // Replace placeholder
        html = html.replace("{{CODE}}", code);
        // true means HTML format
        helper.setText(html, true);
        mailSender.send(message);
    }

    public void resetPasswordEmail(String to, String code) throws MessagingException, IOException {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        // Second parameter is display name
        helper.setFrom(from, "CharityX");
        helper.setTo(to);
        helper.setSubject("[CharityX] Password reset verification code");
        // Read template
        String html = loadHtmlTemplate("templates/reset-password-code.html");
        // Replace placeholder
        html = html.replace("{{CODE}}", code);
        // true means HTML format
        helper.setText(html, true);
        mailSender.send(message);
    }

    public void standardSimpleEmail(String to, String subject, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(from);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        mailSender.send(message);
    }

    @Async("asyncServiceExecutor")
    @Deprecated
    public void asyncSendCodeEmail(String to, String code) {
        standardSimpleEmail(to, "Charity Pay Verification Code", code);
    }

    @Async("asyncServiceExecutor")
    public void asyncSendSceneCodeEmail(EmailSendSceneEnum sceneEnum, String toEmail, String code) {
        try {
            switch (sceneEnum) {
                case REGISTER:
                case LOGIN:
                    verificationEmail(toEmail, code);
                    break;
                case RESET_PASSWORD:
                    resetPasswordEmail(toEmail, code);
                    break;
                case MERGE_STATUS_ACTIVE:
                case MERGE_STATUS_REVOKED:
                case MERGE_STATUS_REJECTED:
                    applicationEmail(sceneEnum, toEmail);
                    break;
                default:
                    log.error("Unsupported email send scene: {}", sceneEnum);
                    standardSimpleEmail(toEmail, "Unsupported email send scene", code);
                    break;
            }
            log.info("[{}]Send email success,ToEmail={},code={}", sceneEnum.getDesc(), toEmail, code);
        } catch (Exception e) {
            log.error("[{}]Send email  error,ToEmail={},code={}: {}", sceneEnum.getDesc(), toEmail, code, e.getMessage());
        }
    }
}
