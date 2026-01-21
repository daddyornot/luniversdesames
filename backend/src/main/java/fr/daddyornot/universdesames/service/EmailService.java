package fr.daddyornot.universdesames.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Async // Exécution dans un thread séparé
    public void sendHtmlEmail(String to, String subject, String templateName, Map<String, Object> templateModel) throws MessagingException {
        try {
            // Simulation de latence pour tester (à retirer en prod)
            // Thread.sleep(5000); 
            
            Context thymeleafContext = new Context();
            thymeleafContext.setVariables(templateModel);
            String htmlContent = templateEngine.process(templateName, thymeleafContext);

            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(mimeMessage);
            System.out.println("Email envoyé avec succès à " + to);
            
        } catch (Exception e) {
            System.err.println("Erreur lors de l'envoi de l'email asynchrone : " + e.getMessage());
            // Ici, on pourrait ajouter une logique de retry ou stocker l'échec en BDD
        }
    }
}
