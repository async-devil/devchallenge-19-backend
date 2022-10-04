[![wakatime](https://wakatime.com/badge/user/bc8fa60c-fa34-4507-b70f-24bdba32a74d/project/bb523255-2461-48ca-a257-ea79fe28c303.svg)](https://wakatime.com/badge/user/bc8fa60c-fa34-4507-b70f-24bdba32a74d/project/bb523255-2461-48ca-a257-ea79fe28c303)

# DEV Challenge XIX backend nomination solution

## Run docker image:

Provides ready to go docker compose config

**Important note!** Database by default gives access to root without password, so please change environment setting for ArangoDB at: `docker-compose.yml` line: `9`

```bash
$ sudo docker compose up
```

## Local installation:

```bash
$ yarn instal
```

## Local start:

**Important note!** Database will not work if valid url and credentials won't be provided at: `src/arangodb/arangodb.service.ts`

```bash
$ yarn start
```

## Test:

```bash
$ yarn test
$ yarn test:cov
```

## Access at:

`http://localhost:8080/api/<method>` or `http://127.0.0.1:8080/api/<method>`

## Api routes:

- POST `/people`
- PUT `/people/:key` _Non requested_
- GET `/people/:key` _Non requested_
- POST `/people/:key/trust_connections`
- GET `/people/:from/trust/connections/:to` _Non requested_
- POST `/messages`
- POST `/path`

## Description

This task is all about graphs, so as database I've chosen ArangoDB as free and graph-capable. It provides simple access to graph iteration functions and data.

The first task, which is message, is a task to send message from start point by broadcast avoiding non-trustable edges and non-suitable vertexes of graph. The main problem was that the message should be sent to vertex only one time, so I implemented filtering to raw valid paths which were given to me by DB.

The second task, which is path, is a task to give the shortest path to a suitable vertex from start point, avoiding non-trustable edges. The main problem here was that the end vertex is not specified, so I implemented filtering by matching topics and then provided them to the shortest path algorithm, the shortest path of shortest paths is the requested one.

## Task you can find at:

`task.pdf`
