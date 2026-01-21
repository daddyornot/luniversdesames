package fr.daddyornot.universdesames.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> templateModel) throws MessagingException {
        Context thymeleafContext = new Context();
        thymeleafContext.setVariables(templateModel);
        String htmlContent = templateEngine.process(templateName, thymeleafContext);

        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8"); // true for multipart message

        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true); // true for HTML content

        mailSender.send(mimeMessage);
    }
}
