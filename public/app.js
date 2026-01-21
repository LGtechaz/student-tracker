const API = "";

function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

async function request(path, options = {}) {
  const res = await fetch(API + path, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });

  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = typeof data === "string" ? data : JSON.stringify(data);
    throw new Error(res.status + " " + msg);
  }
  return data;
}

function escapeHtml(s) {
  return String(s)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderList(el, items, renderItem) {
  if (!items || items.length === 0) {
    el.innerHTML = "Порожньо";
    return;
  }
  el.innerHTML = "<ul>" + items.map(renderItem).join("") + "</ul>";
}

async function reloadUsers() {
  const el = document.getElementById("usersList");
  try {
    const users = await request("/users");
    renderList(el, users, (u) =>
      `<li>#${u.id} ${escapeHtml(u.name)} (${escapeHtml(u.email)}) - ${escapeHtml(u.role)}</li>`
    );
  } catch (e) {
    el.innerHTML = "Помилка: " + escapeHtml(e.message);
  }
}

async function createUser() {
  const name = document.getElementById("userName").value.trim();
  const email = document.getElementById("userEmail").value.trim();
  const role = document.getElementById("userRole").value;

  try {
    await request("/users", {
      method: "POST",
      body: JSON.stringify({ name, email, role }),
    });
    await reloadUsers();
  } catch (e) {
    alert("Не вдалося створити користувача: " + e.message);
  }
}

async function reloadCourses() {
  const el = document.getElementById("coursesList");
  try {
    const courses = await request("/courses");
    renderList(el, courses, (c) =>
      `<li>#${c.id} ${escapeHtml(c.title)} (teacherId: ${escapeHtml(c.teacherId)})</li>`
    );
  } catch (e) {
    el.innerHTML = "Помилка: " + escapeHtml(e.message);
  }
}

async function createCourse() {
  const title = document.getElementById("courseTitle").value.trim();
  const teacherId = Number(document.getElementById("courseTeacherId").value);

  try {
    await request("/courses", {
      method: "POST",
      body: JSON.stringify({ title, teacherId }),
    });
    await reloadCourses();
  } catch (e) {
    alert("Не вдалося створити курс: " + e.message);
  }
}

async function reloadLessons() {
  const el = document.getElementById("lessonsList");
  try {
    const lessons = await request("/lessons");
    renderList(el, lessons, (l) =>
      `<li>#${l.id} ${escapeHtml(l.title)} (courseId: ${escapeHtml(l.courseId)}) - ${escapeHtml(l.date)}</li>`
    );
  } catch (e) {
    el.innerHTML = "Помилка: " + escapeHtml(e.message);
  }
}

async function createLesson() {
  const title = document.getElementById("lessonTitle").value.trim();
  const courseId = Number(document.getElementById("lessonCourseId").value);
  const date = document.getElementById("lessonDate").value.trim();

  try {
    await request("/lessons", {
      method: "POST",
      body: JSON.stringify({ title, courseId, date }),
    });
    await reloadLessons();
  } catch (e) {
    alert("Не вдалося створити заняття: " + e.message);
  }
}

async function enroll() {
  const studentId = Number(document.getElementById("enrollStudentId").value);
  const courseId = Number(document.getElementById("enrollCourseId").value);

  try {
    await request("/enrollment", {
      method: "POST",
      body: JSON.stringify({ studentId, courseId }),
    });
    alert("Студента записано!");
  } catch (e) {
    alert("Не вдалося записати: " + e.message);
  }
}

async function loadStudentsOfCourse() {
  const courseId = Number(document.getElementById("studentsOfCourseId").value);
  const el = document.getElementById("studentsOfCourseList");
  el.innerHTML = "Завантаження...";

  try {
    let data;
    try {
      data = await request(`/enrollment?courseId=${courseId}`);
    } catch {
      data = await request(`/enrollment/course/${courseId}`);
    }

    renderList(el, data, (x) => {
      const student = x.student || x.user || x;
      return `<li>#${student.id} ${escapeHtml(student.name)} (${escapeHtml(student.email)})</li>`;
    });
  } catch (e) {
    el.innerHTML = "Помилка: " + escapeHtml(e.message);
  }
}

async function saveAttendance() {
  const lessonId = Number(document.getElementById("attLessonId").value);
  const studentId = Number(document.getElementById("attStudentId").value);
  const present = document.getElementById("attPresent").value === "true";
  const activity = Number(document.getElementById("attActivity").value);
  const note = document.getElementById("attNote").value.trim();

  try {
    await request("/attendance", {
      method: "POST",
      body: JSON.stringify({ lessonId, studentId, present, activity, note }),
    });
    alert("Збережено!");
  } catch (e) {
    alert("Не вдалося зберегти: " + e.message);
  }
}

async function loadAttendanceByLesson() {
  const lessonId = Number(document.getElementById("attListLessonId").value);
  const el = document.getElementById("attendanceByLessonList");
  el.innerHTML = "Завантаження...";

  try {
    let data;
    try {
      data = await request(`/attendance/lesson/${lessonId}`);
    } catch {
      data = await request(`/attendance?lessonId=${lessonId}`);
    }

    renderList(el, data, (r) =>
      `<li>studentId: ${escapeHtml(r.studentId)} | присутній: ${escapeHtml(r.present)} | активність: ${escapeHtml(r.activity)} | нотатка: ${escapeHtml(r.note ?? "")}</li>`
    );
  } catch (e) {
    el.innerHTML = "Помилка: " + escapeHtml(e.message);
  }
}

async function loadStudentSummary() {
  const studentId = Number(document.getElementById("sumStudentId").value);
  const courseId = Number(document.getElementById("sumCourseId").value);
  const el = document.getElementById("studentSummaryBox");
  el.innerHTML = "Завантаження...";

  try {
    let data;
    try {
      data = await request(`/attendance/student/${studentId}/summary?courseId=${courseId}`);
    } catch {
      data = await request(`/attendance/student/${studentId}?courseId=${courseId}`);
    }

    el.innerHTML = `<pre>${escapeHtml(JSON.stringify(data, null, 2))}</pre>`;
  } catch (e) {
    el.innerHTML = "Помилка: " + escapeHtml(e.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToSection(btn.getAttribute("data-scroll")));
  });

  const bind = (id, fn) => {
    const el = document.getElementById(id);
    if (el) el.addEventListener("click", fn);
  };

  bind("btnCreateUser", createUser);
  bind("btnReloadUsers", reloadUsers);

  bind("btnCreateCourse", createCourse);
  bind("btnReloadCourses", reloadCourses);

  bind("btnCreateLesson", createLesson);
  bind("btnReloadLessons", reloadLessons);

  bind("btnEnroll", enroll);
  bind("btnLoadStudentsOfCourse", loadStudentsOfCourse);

  bind("btnSaveAttendance", saveAttendance);
  bind("btnLoadAttendanceByLesson", loadAttendanceByLesson);
  bind("btnLoadStudentSummary", loadStudentSummary);
});


document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-scroll]").forEach((btn) => {
    btn.addEventListener("click", () => scrollToSection(btn.getAttribute("data-scroll")));
  });

  document.getElementById("btnCreateUser").addEventListener("click", createUser);
  document.getElementById("btnReloadUsers").addEventListener("click", reloadUsers);

  document.getElementById("btnCreateCourse").addEventListener("click", createCourse);
  document.getElementById("btnReloadCourses").addEventListener("click", reloadCourses);

  document.getElementById("btnCreateLesson").addEventListener("click", createLesson);
  document.getElementById("btnReloadLessons").addEventListener("click",хreloadLessons);

  document.getElementById("btnEnroll").addEventListener("click", enroll);
  document.getElementById("btnLoadStudentsOfCourse").addEventListener("click", loadStudentsOfCourse);

  document.getElementById("btnSaveAttendance").addEventListener("click", saveAttendance);
  document.getElementById("btnLoadAttendanceByLesson").addEventListener("click", loadAttendanceByLesson);
  document.getElementById("btnLoadStudentSummary").addEventListener("click", loadStudentSummary);
});
