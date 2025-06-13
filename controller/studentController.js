import { pool } from '../dbconfig.js'
import { EMAIL_REGEX } from '../utils/constant.js'
import { mergeRemoveDuplicates } from '../utils/helper.js';
import { 
  getTeacherIdByEmail, 
  getStudentByTeacherId,
  getTeacherIdByTeacherEmail,
  getStudentId,
  getTeacherId,
  getValidMentionStudents,
  getRegisteredStudents,
  addStudents,
  addTeacher,
  updateSuspendStatus,
  addRegistration,
} from '../queries/studentQuery.js'

const getStudents = async (req, res) => {
  try {
    let teacherEmails = req.query.teacher

    if (!teacherEmails) {
      return res.status(400).send({ message: 'Missing Teacher Parameter!' })
    }

    // Single email in query params
    if (!Array.isArray(teacherEmails)) {
      teacherEmails = [teacherEmails]
    }
    teacherEmails = teacherEmails.map(e => decodeURIComponent(e))
    // console.log('teacherEmails', teacherEmails)

    const teacherRows = await getTeacherIdByEmail(pool, teacherEmails)
    const teacherIds = teacherRows.map(item => item.id)
    // console.log('teacherIds', teacherIds)

    if (teacherIds.length !== teacherEmails.length) {
      return res.status(404).send({ message: 'No Teacher Found For Given Email(s)!' })
    }

    const studentRows = await getStudentByTeacherId(pool, teacherIds)
    const studentEmails = studentRows.map(item => item.email)
    res.status(200).send({ students: studentEmails })
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }
};

const registerStudents = async (req, res) => {
  try {
    const { teacher, students } = req.body

    if (!teacher) {
      return res.status(400).send({ message: 'No Teacher Found!' })
    } else if (students.length === 0) {
      return res.status(400).send({ message: 'No Students Found!' })
    }

    // Insert row if teacher email does not exist else skip for duplicate
    await addTeacher(pool, teacher)
    const teacherIdRow = await getTeacherId(pool, teacher)
    const teacherId = teacherIdRow[0].id
    // console.log('teacherId', teacherId)

    // Insert in students & registration tables
    for (const email of students) {
      await addStudents(pool, email)
      const studentIdRow = await getStudentId(pool, email)
      const studentId = studentIdRow[0].id
      // console.log('studentId', studentId)
      await addRegistration(pool, teacherId, studentId)
    }

    res.status(204).send()
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }
};

const suspendStudent = async (req, res) => {
  try {
    const { student } = req.body
    if (!student) {
      return res.status(400).send({ message: 'Invalid Input!' })
    }
    const result = await updateSuspendStatus(pool, student)
    // console.log(result)
    if (result.affectedRows === 0) {
      return res.status(404).send({ message: 'No Student Email Found!' })
    }

    res.status(204).send()
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }
};

const getStudentsForNotification = async (req, res) => {
  try {
    const { teacher, notification } = req.body

    if (!teacher || !notification) {
      return res.status(400).json({ message: 'Invalid Input!' })
    }

    // get email denoted by @
    const matchList = [...notification.matchAll(EMAIL_REGEX)]
    const mentionEmails = matchList.map(item => item[1])
    // console.log('mentionEmails', mentionEmails)

    //check suspendStatus = 0
    const validMentionStudents = await getValidMentionStudents(pool, mentionEmails)
    const validMentionEmails = validMentionStudents.map(item => item.email)
    // console.log('validMentionEmails', validMentionEmails)
    
    const teacherRow = await getTeacherIdByTeacherEmail(pool, teacher)
    const teacherId = teacherRow[0].id
    // console.log('teacherId', teacherId)

    const registeredStudents = await getRegisteredStudents(pool, teacherId)
    const registeredEmails = registeredStudents.map(item => item.email)
    // console.log('registeredEmails', registeredEmails)

    const result = mergeRemoveDuplicates(registeredEmails, validMentionEmails)
    return res.status(200).send({ recipients: result })
  } catch (e) {
    return res.status(500).send({ message: e.message })
  }
}

export { getStudents, registerStudents, suspendStudent, getStudentsForNotification }