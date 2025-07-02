# Step 1: Build the app using Gradle and JDK 21
FROM gradle:8.4.0-jdk21 AS build
WORKDIR /app
COPY . .
RUN ./gradlew bootJar

# Step 2: Run the built JAR using JDK 21
FROM eclipse-temurin:21-jdk-alpine
WORKDIR /app
COPY --from=build /app/build/libs/*.jar app.jar
ENTRYPOINT ["java", "-jar", "app.jar"]
