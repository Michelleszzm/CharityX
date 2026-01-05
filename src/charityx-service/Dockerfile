# ============ Build Stage ============
FROM 528757795173.dkr.ecr.ap-southeast-1.amazonaws.com/maven:3.9.9-eclipse-temurin-17 AS build

# Build parameters
ARG NEW_JAR_NAME

WORKDIR /app

# Copy Maven configuration files and source code
COPY pom.xml .
COPY src ./src

# Pre-download dependencies to speed up build
RUN mvn dependency:go-offline -B

# Build project (skip tests)
RUN mvn clean package -DskipTests

# ============ Runtime Stage ============
FROM 528757795173.dkr.ecr.ap-southeast-1.amazonaws.com/eclipse-temurin:17-jdk-alpine

ARG ACTIVE_PROFILE
ARG NEW_JAR_NAME
ENV JAR_NAME=${NEW_JAR_NAME}
ENV ACTIVE_PROFILE=${ACTIVE_PROFILE}

WORKDIR /app

# Copy built jar file
COPY --from=build /app/target/*.jar $JAR_NAME

# Startup command
CMD java -jar $JAR_NAME --spring.profiles.active=${ACTIVE_PROFILE:-default}