# ---- Build Phase ----
FROM gradle:8.4.0-jdk21 AS build
WORKDIR /platform
COPY . .
RUN ./gradlew bootJar

# ---- Run Phase ----
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /platform/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
