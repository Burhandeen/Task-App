Node.js Microservices with RabbitMQ

A Node.js microservices project built with JavaScript, MongoDB, RabbitMQ, and Docker.

The project is divided into separate services to keep responsibilities isolated and allow services to communicate through APIs and asynchronous messages.


Architecture

The project consists of:

User Service — handles user-related functionality.
Task Service — handles task-related functionality.
Notification Service — handles notification-related functionality.
MongoDB — provides persistent data storage.
RabbitMQ — provides asynchronous communication between services.

The services are containerized using Docker, with Docker Compose used to manage the supporting infrastructure and services.


Project Structure
.
├── user-service/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── task-service/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── notification-service/
│   ├── package.json
│   ├── Dockerfile
│   └── ...
│
├── docker-compose.yml
├── .gitignore
└── README.md

Each service has its own package.json and Dockerfile, keeping the services independently configurable and containerizable.

Services

User Service
Stack: Express + Mongoose
MongoDB: users databse
Routes:
GET/users - Fetch all users
POST /users - Create new user


Task Service

Stack: Express + Mongoose

MongoDB: tasks database

Routes:
GET /tasks - List all tasks
POST /tasks - Create task

Notification Service

The Notification Service is responsible for processing notification-related operations.

It runs on:

http://localhost:3003

The service connects to both MongoDB and RabbitMQ.


RabbitMQ

RabbitMQ is used as the message broker for asynchronous communication between services.

The project currently uses the following queue:

task_created

The intended message flow is:

Task Service
     │
     │ publish task event
     ▼
 RabbitMQ
     │
     │ task_created queue
     ▼
Notification Service
     │
     │ process notification
     ▼
Notification

This allows task-related events to be processed asynchronously rather than requiring the task service to directly handle notification processing.


RabbitMQ Connection Handling

The Notification Service establishes a connection to RabbitMQ using the RabbitMQ hostname provided by Docker Compose:

amqp://rabbitmq

The service also includes retry handling for RabbitMQ connection failures.

The connection logic attempts to reconnect when RabbitMQ is temporarily unavailable instead of immediately terminating the application.

The connection process:

Attempts to connect to RabbitMQ.
Creates a channel after a successful connection.
Ensures the task_created queue exists.
Logs a successful connection.
If the connection fails, waits before trying again.
Retries up to the configured number of attempts.

This is particularly useful in a Docker environment because application containers can sometimes start before their dependent services are fully ready.

MongoDB

MongoDB runs as a Docker container using the MongoDB Community Server image.

MongoDB is exposed on:

localhost:27017

A Docker named volume is used to persist MongoDB data:

volumes:
  mongo_data:

This means MongoDB data is stored separately from the lifecycle of the MongoDB container.


Docker Compose

Docker Compose is used to manage the project's infrastructure.

The current Compose configuration includes:

MongoDB
RabbitMQ
User Service
Notification Service

RabbitMQ exposes two ports:

5672   → AMQP communication
15672  → RabbitMQ Management UI

MongoDB exposes:

27017

The User Service exposes:

3001

The Task Service exposes:

3002

The Notification Service exposes:

3003


Running the Project
Prerequisites

Make sure you have installed:

Docker
Docker Compose
Start the containers

From the root of the project:

docker compose up --build

To run the containers in detached mode:

docker compose up --build -d


Check running containers
docker compose ps
View logs
docker compose logs

To view the Notification Service logs:

docker compose logs notification-service

To view RabbitMQ logs:

docker compose logs rabbitmq
Stop the containers
docker compose down


RabbitMQ Management Interface

RabbitMQ provides a management interface through the management image.

Once the containers are running, the management interface is available at:

http://localhost:15672

RabbitMQ uses port 5672 for application-level AMQP communication.

Technologies
Node.js
JavaScript
MongoDB
RabbitMQ
Docker
Docker Compose
AMQP
