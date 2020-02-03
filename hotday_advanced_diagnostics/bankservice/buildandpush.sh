#!/bin/bash
## Shell script for building the Jar file and the Docker image

printf "Building the JAR file\n"
mvn clean install

printf "Building the Docker Image with no cache rebuilidung all layers\n"
docker build  --rm -t shinojosa/bankjob:perform2020 . --no-cache=true
printf "push image"
docker push shinojosa/bankjob:perform2020
