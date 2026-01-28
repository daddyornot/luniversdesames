package fr.daddyornot.universdesames;

import org.springframework.boot.test.context.TestConfiguration;

@TestConfiguration(proxyBeanMethods = false)
public class TestContainersConfig {

//    @Bean
//    @ServiceConnection
//    public PostgreSQLContainer<?> postgreSQLContainer() {
//        return new PostgreSQLContainer<>(DockerImageName.parse("postgres:15-alpine"));
//    }
}
