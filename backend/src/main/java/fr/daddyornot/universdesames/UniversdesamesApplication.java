package fr.daddyornot.universdesames;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync // Active le support des méthodes asynchrones
public class UniversdesamesApplication {

	public static void main(String[] args) {
		SpringApplication.run(UniversdesamesApplication.class, args);
	}

}
