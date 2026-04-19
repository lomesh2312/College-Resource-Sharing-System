# College Resource Sharing System

A professional full-stack platform for campus resource sharing, built with **TypeScript**, **Node.js/Express**, and **React**.

## Tech Stack
- **Backend**: Node.js, Express, Prisma ORM, PostgreSQL (Neon).
- **Frontend**: React (Vite), TypeScript, Vanilla CSS.
- **Architecture**: Pure Object-Oriented Design (OOP) with Layered Architecture (Domain, Application, Infrastructure, Presentation).

## Prerequisites
- Node.js (v18+)
- A Neon PostgreSQL database instance.

## Getting Started

### 1. Database Setup
1. Create a project in [Neon](https://neon.tech).
2. Copy your Connection String.
3. In `backend/`, create a `.env` file:
   ```env
   DATABASE_URL="your_neon_connection_string"
   JWT_SECRET="your_secure_secret"
   PORT=5000
   ```
4. Run migrations:
   ```bash
   cd backend
   npx prisma migrate dev --name init
   ```

### 2. Run the Backend
```bash
cd backend
npm run dev
```

### 3. Run the Frontend
1. In `frontend/`, create a `.env` file:
   ```env
   VITE_API_URL="http://localhost:5000/api"
   ```
2. Start the dev server:
   ```bash
   cd frontend
   npm run dev
   ```

## Features
- **User Management**: KYC-style auth, wallet simulation, and profiles.
- **Resource Management**: CRUD operations for items, availability checking.
- **Rental System**: Full lifecycle (Request -> Approve -> Active -> Complete/Late).
- **Business Logic**: Automated deposit handling and progressive fine calculation.
- **Design**: Premium, professional black and white minimalist UI.
