import { Router } from 'express'
import { getStudents, registerStudents, suspendStudent, getStudentsForNotification } from '../controller/studentController.js'

const router = Router()

router.get('/commonstudents', getStudents)
router.post('/register', registerStudents)
router.post('/suspend', suspendStudent)
router.post('/retrievefornotifications', getStudentsForNotification)

export default router