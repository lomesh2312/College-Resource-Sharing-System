# College Resource Sharing System

## 1. Project Overview

The College Resource Sharing System is a full-stack web application that enables students within a college to share, rent, and borrow useful resources such as books, calculators, lab equipment, electronics, and other academic tools.

Instead of purchasing items that are only needed temporarily, students can rent resources from other students in a secure and structured environment. The platform manages listings, bookings, deposits, rental lifecycle, fines, and ratings while ensuring proper validation and business logic through a well-designed backend architecture.

This system emphasizes clean software engineering practices, object-oriented design, and layered architecture.

---

## 2. Problem Statement

In college environments:

- Many students own resources that are rarely used.
- Other students need those resources temporarily.
- There is no structured system to manage lending and borrowing.
- Informal sharing leads to conflicts, late returns, and loss of trust.

The College Resource Sharing System solves this by providing:

- A secure digital platform
- Clear rental lifecycle management
- Deposit and fine handling
- Transparent user ratings
- Proper tracking and accountability

---

## 3. Target Users

- **Students** – Can list items, rent items, manage bookings, and track history.

---

## 4. Scope of the Project

### In Scope

The system will include:

- User authentication and role-based access
- Item listing and management
- Rental booking with date validation
- Deposit handling (wallet simulation)
- Late fine calculation
- Rental lifecycle state management
- Rating and review system
- Transaction tracking

The focus of this project is backend architecture and business logic implementation.

---

## 5. Core Features

### 5.1 User Management

- User registration and login
- JWT-based authentication
- Password encryption
- Student-only access model (peer-to-peer system)
- User wallet balance (simulated)

---

### 5.2 Item Management

Students can:

- Add new items
- Edit item details
- Delete items (if not currently rented)
- Set availability dates
- Define:
  - Deposit amount
  - Rent per day
  - Quantity
  - Category
  - Description

System validations:

- Cannot delete item during active rental
- Cannot edit restricted fields during rental period

---

### 5.3 Browse & Search

- Search by item name
- Filter by category
- Filter by price range
- Sort by price or rating
- Pagination support

---

### 5.4 Rental Booking System

Students can:

- Select rental start date and end date
- Submit booking request

System validates:

- Date overlap
- Availability
- Quantity limits
- Wallet balance for deposit

Rental States:

- REQUESTED
- APPROVED
- ACTIVE
- COMPLETED
- CANCELLED
- LATE

State transitions are controlled by backend logic.

### State Transition Rules

The system enforces strict rental state transitions:

- REQUESTED → APPROVED or CANCELLED
- APPROVED → ACTIVE
- ACTIVE → COMPLETED or LATE
- LATE → COMPLETED (after fine settlement)

Invalid transitions are rejected by the service layer to maintain system consistency.


---


### 5.5 Owner Approval & Notification System

When a student submits a rental request:

- The resource owner receives an in-app notification.
- The request status is set to REQUESTED.
- The owner can either:
  - APPROVE the request
  - REJECT the request

If approved:
- Deposit is deducted from renter’s wallet.
- Rental status becomes ACTIVE.

If rejected:
- Rental status becomes CANCELLED.

Notifications are stored in the system and can be marked as read/unread.

---

### 5.6 Deposit & Wallet System (Simulated)

- Deposit deducted at booking confirmation
- Deposit locked during rental period
- Refund issued upon successful return
- Fine deducted if late
- Transaction history maintained

---

### 5.7 Late Fine Management

- Automatic late detection
- Fine calculated per day
- Deduction from deposit
- Remaining amount refunded

---

### 5.8 Rating & Review System

After rental completion:

- Renter can rate lender
- Lender can rate renter
- Average rating automatically updated
- One rating per completed rental

---

### 5.9 Dashboard

Students can view:

- Active rentals
- Rental history
- Earnings (if lender)
- Pending requests
- Wallet balance

---

## 6. Backend Architecture

The system will follow a clean layered architecture:

- Controllers
- Services
- Repositories
- Models
- Middleware
- Utilities

Design Patterns Used:

- Repository Pattern
- Service Layer Pattern
- Strategy Pattern (for payment handling)
- Singleton Pattern (database connection)

---

## 7. Object-Oriented Design Principles

The project will demonstrate:

- **Encapsulation** – Private properties with controlled access methods.
- **Abstraction** – Clear separation of service logic from controller layer.
- **Inheritance** – Base `User` class extended by `Student`.
- **Polymorphism** – Flexible payment and fine calculation strategies.

---

## 8. Non-Functional Requirements

- Clean and modular code structure
- Proper error handling
- Input validation
- Secure authentication
- Scalable design
- RESTful API structure

---

## 9. Future Enhancements

- Real payment gateway integration
- Notification system
- Chat between renter and lender
- Mobile app version
- AI-based recommendation system
- Platform commission model

---

## 10. Proposed Tech Stack

Backend:
- Node.js with Express (or preferred backend framework)
- REST API architecture
- JWT Authentication

Database:
- MongoDB or PostgreSQL

Frontend:
- React.js (basic UI for interaction)

---

## Business Rules & Data Constraints

The system enforces the following constraints:

- A student cannot rent their own resource.
- A resource cannot be rented if quantity is unavailable.
- Overlapping rental dates are not allowed.
- A student must have sufficient wallet balance to place a request.
- Ratings can only be submitted after rental completion.
- A resource under active rental cannot be modified or deleted.

All validations are handled in the service layer to ensure data integrity.

---

## Conclusion

The College Resource Sharing System is a structured full-stack application designed to demonstrate strong backend architecture, object-oriented principles, and real-world business logic implementation.

The project focuses primarily on backend engineering practices while maintaining a functional and user-friendly frontend interface.
