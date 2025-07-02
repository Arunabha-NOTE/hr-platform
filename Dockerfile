# ---- Build Stage ----
FROM gradle:8.5.0-jdk21 AS builder
WORKDIR /app

# Optional: cache Gradle dependencies
ENV GRADLE_USER_HOME=/home/gradle/.gradle

# Copy only Gradle wrapper and build files first
COPY platform/build.gradle platform/settings.gradle ./
COPY platform/gradle ./gradle
COPY platform/gradlew ./gradlew

# Let it download dependencies (caching layer)
RUN ./gradlew build -x test || true

# Copy the rest of the project
COPY platform/. .

# Build the Spring Boot app
RUN ./gradlew clean build -x test

# ---- Run Stage ----
FROM eclipse-temurin:21-jdk
WORKDIR /app

# Copy the JAR from the build stage
COPY --from=builder /app/build/libs/*.jar app.jar

# Expose the port (if needed by Coolify)
EXPOSE 8080

# Run the app
ENTRYPOINT ["java", "-jar", "app.jar"]
