FROM eclipse-temurin:25-jdk-alpine AS build

WORKDIR /workspace

COPY .mvn .mvn
COPY mvnw pom.xml ./
RUN sh ./mvnw --batch-mode --no-transfer-progress dependency:go-offline

COPY src src
RUN sh ./mvnw --batch-mode --no-transfer-progress \
    -Dmaven.antrun.skip=true \
    -DskipTests \
    package

FROM eclipse-temurin:25-jre-alpine

RUN addgroup -S runtime && adduser -S runtime -G runtime

WORKDIR /app
COPY --from=build --chown=runtime:runtime /workspace/target/backend-*.jar app.jar

USER runtime
EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
