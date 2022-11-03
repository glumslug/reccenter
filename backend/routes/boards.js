const express = require('express')
const {
    getBoards, getBoard, deleteBoard, updateBoard, updateBoardName, searchBoards, createBoard, updateBoardIcon, getBoardByUser, addBoardGroup, removeBoardGroup, sendGroupInvite, removeGroupInvite, sendFriendRequest, declineFriend, addFriend, unFriend,
} = require('../controllers/boardsControllers')
const router = express.Router()
const multer = require("multer")


//Middleware
const {protect} = require('../middleware/authMiddleware')

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

//GET all boards
router.get('/', getBoards)

//GET a single board
router.get('/:id', getBoard)

//GET board by user
router.get('/by-user/:id', getBoardByUser)

//POST a new board
router.post('/', upload.single("userIcon"), protect, createBoard)

//DELETE a board
router.delete('/:id', deleteBoard)

//UPDATE a board name
router.patch('/:id/name', protect, updateBoardName)


//UPDATE a board (schedule mostly)
router.patch('/:id', protect, updateBoard)

//ADD a group to board
router.patch('/:id/add-group', protect, addBoardGroup)

//REMOVE a group from board
router.patch('/:id/remove-group', removeBoardGroup)

//UPDATE a board icon
router.patch('/:id/icon', protect, upload.single("userIcon"), updateBoardIcon)

//SEND a group invite
router.patch('/:id/invite', sendGroupInvite)

// Send friend request
router.patch('/friend-request/:targetId', sendFriendRequest)

// Accept friend request
router.patch('/accept-friend/:id', protect, addFriend)

// Decline friend request
router.patch('/decline-friend/:id', declineFriend)

// Destroy a friendship :'(
router.patch('/unfriend/:id', unFriend)

//Remove a group invite
router.patch('/:id/remove-invite', removeGroupInvite)

//SEARCH Boards
router.get('/search/:search', searchBoards)

module.exports = router