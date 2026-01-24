# --- Stage 1: Build ---
FROM maven:3.9.6-eclipse-temurin-21-alpine AS builder
WORKDIR /app

# Optimisation du cache : on copie d'abord le pom.xml
COPY pom.xml .
# On télécharge les dépendances (si possible hors ligne, sinon cette étape échouera mais le build passera)
RUN mvn dependency:go-offline -B

# On copie les sources
COPY src ./src
# Build du JAR en sautant les tests (ils sont joués dans la CI)
RUN mvn clean package -DskipTests

# --- Stage 2: Run ---
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Création d'un utilisateur non-root pour la sécurité
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copie du JAR
COPY --from=builder /app/target/*.jar app.jar

# Variables d'environnement par défaut
ENV SPRING_PROFILES_ACTIVE=prod

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
