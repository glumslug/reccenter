const express = require('express')
const router = express.Router()
const {
    registerUser, loginUser, getUser, searchUsers, updateUser, updateAccount, sendMail, resetPassword, deleteUser, getAllUsers
} = require('../controllers/userController')

const {protect} = require('../middleware/authMiddleware')


//Register a user
router.post('/', registerUser)

router.post('/login', loginUser)

router.get('/:id', getUser)

router.get('/', getAllUsers)

router.get('/search/:search', searchUsers)

//Update a user's board
router.patch('/update/:id', protect, updateUser)

//Update a user's account
router.patch('/update-account/:id', protect, updateAccount)

//Delete account
router.delete('/delete-account/:id', deleteUser)

//Send email
router.post('/forgot-password', sendMail)

//Reset a password
router.patch('/reset-password/', protect, resetPassword)

module.exports = router