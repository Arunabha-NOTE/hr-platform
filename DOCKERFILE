# Build stage
FROM gradle:8.4.0-jdk17 AS build
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

# Runtime stage
FROM eclipse-temurin:17-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
