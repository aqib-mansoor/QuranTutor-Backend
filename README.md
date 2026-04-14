# 📖 Quran Tutor Backend API

A scalable backend system for a Quran Tutoring Platform built with **Node.js, Express, MongoDB, and TypeScript**.  
It provides role-based access for **Admins, Teachers, and Students** with complete management of classes, attendance, progress, homework, and fees.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- TypeScript
- MongoDB (Mongoose)
- JWT Authentication
- REST API Architecture

---

## 📁 Features

### 🔐 Authentication & Authorization
- JWT-based login system
- Role-based access control (Admin / Teacher / Student)

### 👨‍🏫 Admin Panel
- Manage Teachers & Students
- Assign teachers to students
- Create & manage classes
- Attendance tracking (students & teachers)
- Fee management
- Trial request handling
- Dashboard statistics

### 👨‍🏫 Teacher Panel
- View assigned students
- Manage schedule
- Update student progress
- Assign & verify homework
- Mark attendance
- Update profile

### 🎓 Student Panel
- View upcoming classes
- Check progress reports
- Submit homework
- Give feedback to teachers
- View attendance history

### 🌍 Public APIs
- Submit trial request
- Login system

---

## 📡 Base URL
http://localhost:5001/api/v1

---

## 🔐 Authentication

All protected routes require:
Authorization: Bearer <JWT_TOKEN>

---

## 📌 API Modules

### Public Routes
- POST `/public/trial-request`
- POST `/auth/login`

---

### Admin Routes
- `/admin/teachers`
- `/admin/students`
- `/admin/classes`
- `/admin/attendance`
- `/admin/fees`
- `/admin/dashboard/stats`

---

### Teacher Routes
- `/teacher/students`
- `/teacher/schedule`
- `/teacher/progress`
- `/teacher/homework`
- `/teacher/attendance`

---

### Student Routes
- `/student/classes/upcoming`
- `/student/progress`
- `/student/homework`
- `/student/feedback`

---

### Project Structure

src/

 ├── controllers/
 
 ├── models/
 
 ├── routes/
 
 ├── middleware/
 
 ├── services/
 
 ├── utils/
 
 └── app.ts

## Author

Aqib Mansoor
Full Stack Developer!
