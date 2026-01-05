package service;

import com.charity.x.Application;
import com.charity.x.common.menu.EmailSendSceneEnum;
import com.charity.x.service.manager.EmailManager;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

/**
 * @Author: Lucass @Date: 2025/11/5 21:05 @Description:
 */
@Slf4j
@SpringBootTest(classes = Application.class)
public class EmailManagerTest {
    public static final String EMAIL = "2295471337@qq.com";
    public static final String GOOGLE = "beginnice1993@gmail.com";

    @Autowired
    private EmailManager emailManager;

    @Test
    public void testEmail() throws Exception {
        //emailManager.asyncSendSceneCodeEmail(EmailSendSceneEnum.LOGIN,GOOGLE, "123456");
        emailManager.asyncSendSceneCodeEmail(EmailSendSceneEnum.RESET_PASSWORD,GOOGLE, "123456");
    }
}
