const express = require('express')
const {
    createGroup, getGroups, getGroup, deleteGroup, updateGroup, searchGroups, updateGroupMembers, removeMember, updateGroupIcon, sendGroupRequest, manageGroupRequest, manageAdmins
} = require('../controllers/groupsControllers')
const router = express.Router()
const multer = require("multer")

//Multer stuff
const fileFilter = (req, file, cb) => {
    if(file.mimetype.split("/")[0] === "image"){
        cb(null, true)
    } else {
        cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"), false)
    }
};
const storage = multer.memoryStorage();

const upload = multer({
    storage,
    fileFilter,
})

//GET all Groups
router.get('/', getGroups)

//GET a single Group
router.get('/:id', getGroup)

//POST a new Group
router.post('/', upload.single("groupIcon"), createGroup)

//DELETE a Group
router.delete('/:id', deleteGroup)

//UPDATE a Group
router.patch('/:id', updateGroup)

//UPDATE a group icon
router.patch('/:id/icon', upload.single("groupIcon"), updateGroupIcon)

//REMOVE a Group member
router.patch('/:id/remove-member', removeMember)

// Ask to join a group
router.patch('/:id/send-request', sendGroupRequest)

// Accept or decline group request
router.patch('/:id/manage-request', manageGroupRequest)

//UPDATE Group members
router.patch('/:id/add-member/:member', updateGroupMembers)

//UPDATE Group admins
router.patch('/:groupId/manage-admins', manageAdmins)

//search groups context
router.get('/search/:search', searchGroups)

module.exports = router