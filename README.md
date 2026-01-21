# 🎓 Student Tracker API

Backend API for managing students, courses, lessons, enrollments, and attendance tracking.  
Built with NestJS, Prisma, and PostgreSQL.

---

## 🧩 Modules

| Module | Description |
|------|------------|
| Users | Manage students and teachers |
| Courses | Create and manage courses |
| Lessons | Lessons inside courses |
| Enrollment | Enroll students into courses |
| Attendance | Track lesson attendance and activity |

---

## 🔁 Entity & Data Flow

### Database (PostgreSQL)

#### User
- id  
- name  
- email  
- role (STUDENT / TEACHER)  

#### Course
- id  
- title  
- teacherId  

#### Lesson
- id  
- title  
- date  
- courseId  

#### Enrollment
- id  
- studentId  
- courseId  

#### AttendanceRecord
- id  
- lessonId  
- studentId  
- present (boolean)  
- activity (number)  
- note (string | null)  

---

## 🔗 Relationships (simplified)

- User (TEACHER) → teaches → Course
- User (STUDENT) → enrolled in → Course
- Course → has many → Lesson
- Lesson → has many → AttendanceRecord
- User (STUDENT) → has many → AttendanceRecord

---

## 🚀 API Endpoints

### Users

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /users | Create user |
| GET | /users | Get all users |
| GET | /users/:id | Get user by id |
| PATCH | /users/:id | Update user |
| DELETE | /users/:id | Delete user |

---

### Courses

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /courses | Create course |
| GET | /courses | Get all courses |
| GET | /courses/:id | Get course by id |
| PATCH | /courses/:id | Update course |
| DELETE | /courses/:id | Delete course |

---

### Lessons

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /lessons | Create lesson |
| GET | /lessons | Get all lessons |
| GET | /lessons/:id | Get lesson by id |
| PATCH | /lessons/:id | Update lesson |
| DELETE | /lessons/:id | Delete lesson |

---

### Enrollment

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /enrollment | Enroll student to course |
| GET | /enrollment/course/:courseId | Get students of course |

---

### Attendance

| Method | Endpoint | Description |
|------|---------|------------|
| POST | /attendance | Create or update attendance |
| GET | /attendance/lesson/:lessonId | Get attendance for lesson |
| GET | /attendance/student/:studentId/summary?courseId= | Student attendance summary |

---

