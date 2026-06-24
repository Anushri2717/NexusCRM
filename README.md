# Enterprise CRM System

A full-stack Customer Relationship Management (CRM) application developed to manage leads, customers, and sales pipelines efficiently. The system provides businesses with tools to track opportunities, monitor team performance, and maintain customer interactions through a centralized dashboard.

---

## 📌 Project Overview

The Enterprise CRM System simplifies the sales workflow by enabling organizations to:

- Capture and manage potential leads.
- Track deals through various sales stages.
- Maintain customer communication history.
- Monitor sales team performance.
- Control user permissions using role-based access.

The project follows a scalable MERN architecture and exposes RESTful APIs for seamless communication between the frontend and backend.

---

## 🎯 Objectives

- Streamline lead and customer management.
- Improve visibility into sales activities.
- Enhance collaboration among sales teams.
- Provide actionable insights through dashboards.
- Ensure secure access based on user roles.

---

## 🚀 Features

### 1. Lead Tracking & Deal Stages
- Create, update, and manage leads.
- Convert leads into customers.
- Move deals through configurable sales stages:
  - New Lead
  - Contacted
  - Qualified
  - Proposal Sent
  - Negotiation
  - Won
  - Lost

### 2. Sales Performance Dashboard
- Visual representation of sales metrics.
- Revenue tracking.
- Lead conversion statistics.
- Performance insights for sales representatives.
- Pipeline overview.

### 3. Email & Activity Logs
- Maintain records of customer interactions.
- Log calls, meetings, and follow-ups.
- Store email communication history.
- View complete activity timelines.

### 4. Role-Based Access Control (RBAC)
Different levels of user access:

#### Admin
- Manage users.
- Assign roles.
- Access all CRM functionalities.

#### Sales Manager
- Monitor team performance.
- Manage assigned pipelines.
- View reports and analytics.

#### Sales Representative
- Manage personal leads and deals.
- Update customer activities.
- Record communications.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- JavaScript (ES6+)
- React Router
- Axios
- CSS / Bootstrap

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose ODM

### APIs
- RESTful APIs

### Authentication & Security
- JWT Authentication
- Password Hashing (bcrypt)
- Role-Based Authorization

---

---

## ⚙️ Installation

### Install Backend Dependencies

```bash
cd backend
npm install
npm start dev
```
---

### Install Frontend Dependencies

```bash
cd frontend
npm install
npm start dev
```
---

## 🔐 Environment Variables

Create a `.env` file inside the server directory.

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
CLIENT_URL=http://localhost:3000
```

---

```
The application will be available at:

Frontend:
```
http://localhost:3000
```

Backend:
```
http://localhost:5000
```
---

## API Modules

### Authentication
- POST `/api/auth/register`
- POST `/api/auth/login`

### Leads
- GET `/api/leads`
- POST `/api/leads`
- PUT `/api/leads/:id`
- DELETE `/api/leads/:id`

### Customers
- GET `/api/customers`
- POST `/api/customers`

### Activities
- GET `/api/activities`
- POST `/api/activities`

### Dashboard
- GET `/api/dashboard`

### Users
- GET `/api/users`
- PUT `/api/users/:id/role`

---

## 🔒 Security Features

- JWT-based authentication.
- Password encryption using bcrypt.
- Protected API routes.
- Role-based authorization.
- Input validation and error handling.

---


## Testing

Future testing support may include:

- Jest
- React Testing Library
- Supertest

---

## Learning Outcomes

Through this project, I gained hands-on experience in:

- Building full-stack applications using the MERN stack.
- Designing RESTful APIs.
- Implementing authentication and authorization.
- Managing MongoDB databases.
- Developing responsive user interfaces.
- Structuring scalable enterprise applications.

---

## Internship Information

This project was developed as part of the **1-Month Web Developer Internship Program** offered by Codec Technologies.

The internship focused on practical implementation of modern web development concepts through industry-oriented projects and hands-on learning experiences.

---

## Author

A.Anushri

Web Developer Intern

GitHub: https://github.com/Anushri2717

---