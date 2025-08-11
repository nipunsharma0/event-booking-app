<!-- # event-booking-app

Visit  https://event-booking-app-frontend.onrender.com/  or  https://n1pun.codes to checkout the website. -->

# Evently: Full-Stack Event Booking Platform

[![Live Demo](https://img.shields.io/badge/Live-Demo-brightgreen?style=for-the-badge)](https://event-booking-app-frontend.onrender.com/) (https://n1pun.codes)

An advanced, full-stack event booking platform built with the MERN stack (MongoDB, Express.js, React, Node.js) and deployed using Docker. This application provides a seamless experience for users to discover and book events, while offering a comprehensive dashboard for administrators to manage all aspects of the platform.

---

## Features

### 👤 User Features (Customer Side)
* **Secure Authentication:** JWT-based user registration with email verification and secure login/logout.
* **Event Discovery:** Browse a list of all events, with detailed individual pages for each.
* **Advanced Filtering & Search:** Filter events by category, city, date range, and price. Search for events by name.
* **Pagination:** Smoothly navigate through a large number of events.
* **Seat Booking:** Authenticated users can book a specific number of seats for an event.
* **Redirect on Login:** If a user tries to book an event while logged out, they are redirected to the login page and then returned to the event page after a successful login.
* **User Profile:** A personal dashboard showing a categorized list of upcoming and past event bookings.

### 🔐 Admin Features (Management Side)
* **Protected Dashboard:** A secure, admin-only dashboard for platform management.
* **Event CRUD:** Full Create, Read, Update, and Delete functionality for events, including image uploads.
* **Booking Management:** View a complete list of all bookings made by all users across the platform.
* **User Management:** View a list of all registered users and click on any user to see their specific booking history.
* **Booking Analytics:** View statistics on bookings per event, including total bookings, seats sold, and revenue generated.

---

## Tech Stack

* **Frontend:** React, Vite, React Router, Axios, Tailwind CSS, DaisyUI
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (with Mongoose)
* **Authentication:** JSON Web Tokens (JWT), bcryptjs
* **Validation:** Zod
* **File Uploads:** Multer
* **Email:** Nodemailer
* **Deployment:** Docker, Docker Compose

---

## Prerequisites

Before you begin, ensure you have the following installed on your local machine:
* [Node.js](https://nodejs.org/en/) (v18.x or later recommended)
* [Docker](https://www.docker.com/products/docker-desktop/) and Docker Compose
* [Git](https://git-scm.com/)

---

## Local Setup Instructions

### 1. Clone the Repository
```bash
git clone [https://github.com/nipunsharma0/event-booking-app.git](https://github.com/nipunsharma0/event-booking-app.git)
cd event-booking-app
```
### 2. Configure Backend
```bash

cd server

npm install

touch .env

npm run dev
```

### 3. Configure Frontnd
```bash

cd client

npm install

touch .env

npm run dev

```
---

## Docker Setup Instructions

### 1. Configure Root Environment File
Create a .env file in the root directory of the project (at the same level as docker-compose.yml). Copy the necessary "environment variables" below into this file.

### 2. Build and Run Containers
From the root directory, run the following command in your terminal:

```bash
docker-compose up --build
```

* The frontend will be accessible at http://localhost:5173 (or your configured port).

*  The backend API will be accessible at http://localhost:3000.

### 3. Stop the Containers
To stop the application, press Ctrl + C in the terminal where the containers are running, and then run:

```bash
docker-compose down
```
---

## Environment Variables Configurations

You will need to create .env files for local development and configure them in your deployment service.

**server/.env** (for local backend development)

```bash
PORT=3000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_super_long_and_secret_jwt_string

# Nodemailer Gmail Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
```

**client/.env** (for local frontend development)

```bash
VITE_API_URL=http://localhost:3000/api
```

#### **.env** (in the root, for Docker)
This file should contain all the same variables as server/.env.

```bash
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_long_and_secret_jwt_string
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_character_gmail_app_password
```
---

# Docker Configuration Files

## 1. Backend Dockerfile
This file builds the container for your Node.js/Express server.

File Location: **server/Dockerfile**

```bash
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN mkdir -p uploads

EXPOSE 3000

CMD ["npm", "start"]
```

## 2. Frontend Dockerfile
This is a multi-stage Dockerfile. It first builds your React application into static files and then serves them using a lightweight nginx web server. This is a production-ready setup.

File Location: client/Dockerfile
```bash
# === Stage 1: Build the React App ===
FROM node:18-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build

# === Stage 2: Serve with Nginx ===
FROM nginx:stable-alpine

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```


## 3. Docker Compose File
This file orchestrates both your frontend and backend containers, making them work together.

File Location: docker-compose.yml (in root directory)

```bash
services:
  backend:
    build: ./server
    ports:
      - "3000:3000"
    environment:
      - MONGO_URI=${MONGO_URI}
      - PORT=${PORT}
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASS=${EMAIL_PASS}

  frontend:
    build: ./client
    ports:
      - "5173:80"
    depends_on:
      - backend
```
---
## Nginx Configuration
This configuration file is essential for a single-page React application. It tells the Nginx server to redirect all page requests back to your index.html file. This allows React Router to handle the routing on the client-side instead of the server trying to find a physical file for each URL.

File Location: **client/nginx.conf**

```bash
server {
  listen 80;

  location / {
    root   /usr/share/nginx/html;
    index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  error_page   500 502 503 504  /50x.html;
  location = /50x.html {
    root   /usr/share/nginx/html;
  }
}
```

---

---

# Test Accounts

```bash
// admin
{
    "email": "nipun4colg@gmail.com",
    "password": "Nipun@11"
}

// user 
{
    "email": "vedanshdubey@gmail.com",
    "password": "Vedansh@1"
}

```
---
