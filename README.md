[![wakatime](https://wakatime.com/badge/user/bc8fa60c-fa34-4507-b70f-24bdba32a74d/project/bb523255-2461-48ca-a257-ea79fe28c303.svg)](https://wakatime.com/badge/user/bc8fa60c-fa34-4507-b70f-24bdba32a74d/project/bb523255-2461-48ca-a257-ea79fe28c303)

# DEV Challenge XIX backend nomination solution

_29.09.22 14:00 - 04.10.22 00:00_

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

## Results

| **Criteria**             | **Points** | **Max points** |
| ------------------------ | :--------: | :------------: |
| **Technical assessment** |   **93**   |    **166**     |
| Result correctness       |     48     |       90       |
| Following API format     |     26     |       38       |
| Performance              |     19     |       38       |
| **Expert assessment**    |   **76**   |     **90**     |
| Code quality             |     30     |       38       |
| Test                     |     46     |       52       |
| **Bonus task**           |   **87**   |    **128**     |
| Result Correctness       |     59     |       90       |
| Following API format     |     28     |       38       |
| **_Total_**              | **_256_**  |   **_384_**    |

The threshold score for passing to the final is **175**.

## Task you can find at:

`task.pdf`
