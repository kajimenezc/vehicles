FROM openjdk:25-jdk-slim AS build

WORKDIR /app

COPY pom.xml .

RUN apt-get update && apt-get install -y maven

RUN mvn dependency:go-offline -B

COPY src ./src

RUN mvn clean package -DskipTests

FROM openjdk:25-jre-slim

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]