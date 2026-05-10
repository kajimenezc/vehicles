FROM openjdk:21-jdk-slim AS build

WORKDIR /app

COPY pom.xml .

RUN apt-get update && apt-get install -y maven

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:21-jre-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8761

ENTRYPOINT ["java", "-jar", "app.jar"]