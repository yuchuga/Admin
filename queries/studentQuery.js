export const getTeacherIdByEmail = async (pool, emails) => {
  const _email = new Array(emails.length).fill('?').join(',') //?,?
  const [rows] = await pool.query(`SELECT id FROM TEACHERS WHERE email IN (${_email})`, emails)
  return rows
};

export const getStudentByTeacherId = async (pool, teacherIds) => {
  const _id = new Array(teacherIds.length).fill('?').join(',')
  // Return students matching all provided teacherIds
  const [rows] = await pool.query(
    `
      SELECT s.email FROM students s
      JOIN registration r ON s.id = r.student_id
      WHERE r.teacher_id IN (${_id})
      GROUP BY s.id
      HAVING COUNT(DISTINCT r.teacher_id) = ?  
    `,
    [...teacherIds, teacherIds.length])
  return rows
};

export const getTeacherIdByTeacherEmail = async (pool, teacher) => {
  const [rows] = await pool.query('SELECT id FROM TEACHERS WHERE email = ?', [teacher])
  return rows
};

export const getRegisteredStudents = async (pool, teacherId) => {
  const [rows] = await pool.query(
    `
      SELECT s.email FROM students s
      JOIN registration r ON r.student_id = s.id
      WHERE r.teacher_id = ? AND s.suspend_status = 0
    `
    , [teacherId])
  return rows
};

export const getValidMentionStudents = async (pool, emails) => {
  const [rows] = await pool.query('SELECT email FROM students WHERE email IN (?) AND suspend_status = 0', [emails])
  return rows
};

export const getTeacherId = async (pool, teacher) => {
  const [rows] = await pool.query('SELECT id FROM teachers WHERE email = ?', [teacher])
  return rows
};

export const getStudentId = async (pool, studentEmail) => {
  const [rows] = await pool.query('SELECT id FROM students WHERE email = ?', [studentEmail])
  return rows
};

export const addTeacher = async (pool, teacher) => {
  const [rows] = await pool.query('INSERT IGNORE INTO teachers (email) VALUES (?)', [teacher])
  return rows
};

export const addStudents = async (pool, studentEmail) => {
  const [rows] = await pool.query('INSERT IGNORE INTO students (email, suspend_status) VALUES (?, 0)', [studentEmail])
  return rows
};

export const addRegistration = async (pool, teacherId, studentId) => {
  const [rows] = await pool.query('INSERT IGNORE INTO registration (teacher_id, student_id) VALUES (?, ?)', [teacherId, studentId])
  return rows
}

export const updateSuspendStatus = async (pool, student) => {
  const [rows] = await pool.query('UPDATE students SET suspend_status = 1 WHERE email = ?', [student])
  return rows
};
