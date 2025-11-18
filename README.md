# triluxform
trilux configurator form

## Docker commands for developers
In the root there is a docker compose file that contains all the information for running docker containers for APACHE/PHP/MYSQL
To run this dockerfile localy make sure you installed docker: [Docker website](https://docs.docker.com/engine/install/)
```
# to build your current docker compose file with no cache and verbose output
docker compose build --no-cache --progress=plain 

# when build run your container with
docker compose up -d

# Go to you browser
http://localhost:8080/form.html

# bash into your running container to test stuff
docker exec -it devtools bash 

# Stop your container with
docker compose down
```

## Docker environment
There is a docker folder containing some extra information:
| Path | Contains | Explain |
|------|------|------|
| ./docker/config/php | Php.ini | PHP settings |
| ./docker/config/vhost | apache vhost conf | Webserver config |
| ./docker/image/apache | Dockerfile for apache | Docker build options Apache/PHP |
| ./docker/image/mysql |Dockerfile for mysql | Docker build options Mysql |
| ./docker/logs/apache2 | Apache 2 logs | apache error / access logs |
| ./docker/logs/mysql | Mysql logs | Mysql errors (not enabled by default) |