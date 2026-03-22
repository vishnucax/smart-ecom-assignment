# Smart E-Commerce Checkout Workflow (Node.js + MySQL + RabbitMQ)

## Project Overview

This project implements a **Smart E-Commerce Checkout Backend Workflow** using **Node.js, Express, MySQL, and RabbitMQ**.
It simulates how a real-world e-commerce platform processes checkout operations through multiple backend services.

The system demonstrates how different services communicate using both:

* REST APIs (synchronous communication)
* RabbitMQ messaging (asynchronous communication)

The workflow ensures that when a payment is completed successfully, inventory is automatically updated without direct coupling between services.

---

## Objective of the Project

The objective of this project is to design and implement a **service-based checkout workflow** that includes:

* Inventory management
* Cart processing
* Discount application
* Payment handling
* Event-driven inventory updates using RabbitMQ

This architecture reflects how scalable enterprise e-commerce platforms operate internally.

---

## Technology Stack

| Technology | Purpose                |
| ---------- | ---------------------- |
| Node.js    | Backend runtime        |
| Express.js | REST API framework     |
| MySQL      | Data persistence       |
| RabbitMQ   | Asynchronous messaging |
| Postman    | API testing            |

---

## System Architecture

The project is structured as multiple backend services communicating together:

Inventory Service
Cart Service
Payment Service
Discount Service
RabbitMQ Event Broker

### Workflow Sequence

Inventory → Cart → Discount → Payment → RabbitMQ Event → Inventory Update

This ensures loose coupling between services and improves scalability.

---

## Database Design

The system uses a MySQL database named:

ecommerce

### Inventory Table

Stores product information.

Fields:

* id
* product_name
* quantity
* price
* sku

Purpose:

Tracks available stock and updates automatically after successful payment.

---

### Cart Table

Stores items selected by the user.

Fields:

* id
* product_id
* quantity
* total_price

Purpose:

Acts as temporary storage before checkout.

---

### Orders Table

Stores order summary information.

Fields:

* order_id
* total_amount
* discount_amount
* status
* created_at

Purpose:

Represents finalized transactions.

---

### Payments Table

Stores payment processing results.

Fields:

* payment_id
* order_id
* amount
* discount_applied
* status
* created_at

Purpose:

Records payment success or failure.

---

## Services Implemented

### 1. Inventory Service

Responsibilities:

* Add new product
* View all products
* View individual product
* Update stock automatically after purchase

Example APIs:

POST /inventory
GET /inventory
GET /inventory/:id
PUT /inventory/:id

---

### 2. Cart Service

Responsibilities:

* Add product to cart
* Calculate total price automatically
* View cart contents

Example APIs:

POST /cart
GET /cart

---

### 3. Discount Service

This service applies promotional discounts before payment.

Supported codes:

NEWYEAR → 10% discount
WELCOME → 5% discount

If no valid discount code is provided, payment proceeds normally.

---

### 4. Payment Service

Responsibilities:

* Accept cart ID
* Apply discount (if available)
* Store payment record
* Publish event to RabbitMQ queue

Example API:

POST /payment/process

This triggers inventory update asynchronously.

---

## RabbitMQ Integration

RabbitMQ enables communication between services without direct dependency.

### Publisher

Payment Service publishes:

payment_processed event

Payload includes:

cart_id
payment_id
amount

---

### Consumer

Inventory Service listens for:

payment_processed event

After receiving event:

Inventory quantity is automatically reduced based on cart contents.

This demonstrates event-driven architecture.

---

## End-to-End Workflow Explanation

Step 1:

Product is added into inventory database.

Step 2:

User adds item to cart.

Step 3:

Cart calculates total price automatically.

Step 4:

User applies optional discount code.

Step 5:

Payment service processes transaction.

Step 6:

Payment service publishes event to RabbitMQ.

Step 7:

Inventory service consumes event.

Step 8:

Inventory quantity updates automatically.

This confirms asynchronous communication between services.

---

## API Testing Using Postman

Example testing order:

1. Add inventory item
2. Add product to cart
3. View cart details
4. Process payment with discount
5. Verify inventory reduction

This demonstrates the full checkout lifecycle.

---

## How to Run the Project

### Step 1: Clone Repository

git clone <repository-link>

cd Smart-E-commerce-backend

---

### Step 2: Install Dependencies

npm install

---

### Step 3: Configure Environment Variables

Create .env file:

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=ecommerce
RABBITMQ_URL=amqp://localhost

---

### Step 4: Start Required Services

Start:

MySQL server
RabbitMQ server

---

### Step 5: Run Application

node server.js

Server runs on:

http://localhost:3000

---

## Expected Output

After successful payment:

* Discount applied correctly
* Payment stored in database
* RabbitMQ event triggered
* Inventory automatically reduced
* Updated inventory visible via API

---

## Learning Outcomes

This project demonstrates:

REST API design
Database integration with MySQL
Microservice-style architecture
Event-driven communication using RabbitMQ
Backend workflow automation
Real-world checkout system simulation

---

## Conclusion

This project successfully simulates a production-style e-commerce checkout workflow using asynchronous service communication.

RabbitMQ ensures that inventory updates occur independently after payment confirmation, improving scalability and maintainability of the system.

The architecture reflects modern backend engineering practices used in enterprise commerce platforms.

---

