const Board = require('../models/boardModel')
const User = require('../models/userModel')
const Group = require('../models/groupModel')
const mongoose = require('mongoose')
const { s3Uploadv2, s3delete } = require('../s3service')

// create new board
const createBoard = async (req, res) => {
    const user = req.user.id;
    const name = req.body.name;

    const file = req.file
    const upload = file ? await s3Uploadv2(file) : null
    const icon = upload ? upload.Key.split("/")[1] : 'user-solid.svg'
    
    const schedule = {
        "0": [false, false, false],
        "1": [false, false, false],
        "2": [false, false, false],
        "3": [false, false, false],
        "4": [false, false, false],
        "5": [false, false, false],
        "6": [false, false, false]
    }
    const groups = []
    

    // add doc to db
    try{
        const board = await Board.create({user, name, icon, schedule, groups})
        const boardId = board._id.toString()
        const updateUser = await User.findOneAndUpdate({_id: user}, {
            $push:{"boards": boardId}})

        res.status(200).json(updateUser)
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}

// get all boards
const getBoards = async (req, res) => {
    const boards = await Board.aggregate([{$project: {schedule: 0}}]).sort({user: 1})

    res.status(200).json(boards)
}

// get a single board
const getBoard = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }
    const board = await Board.findById(id)

    if (!board) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(board)
} 

// get board by user
const getBoardByUser = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }
    const board = await Board.find({ user: id })

    if (!board) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(board)
} 

// delete a board
const deleteBoard = async (req, res) => {
    const boardId = req.params.id
    const board = await Board.findById(boardId)
    const groups = await board.groups
    
    if (!board) {
        res.status(400)
        throw new Error('Board not found')
    }

    // // Check for user
    // if (!req.user) {
    //     res.status(401)
    //     throw new Error('User not found')
    // }
    // //Make sure logged in user matches the board user
    // if(board.user.toString() !== req.user.id) {
    //     res.status(401)
    //     throw new Error('User not authorized')
    // }

    //Remove board from all groups
    Promise.all(groups.map((group)=>Group.findOneAndUpdate({_id: group}, {
        $pull:{"members": boardId}})))

    //Remove board from user document
    await User.findOneAndUpdate({_id: board.user}, {
        $pull:{"boards": boardId}})

    //Delete board
    await board.remove()
    
     res.status(200).json({ id: req.params.id})
    
   
    
    
}

// update a board
const updateBoard = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    const board = await Board.findById(id)

    if (!req.user) {
        req.status(401)
        throw new Error('User not found')
    }
    if (!board) {
        req.status(401)
        throw new Error('Board not found')
    }
    //Make sure logged in user matches the board user
    if(board.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }

    const update = await Board.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!update) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(update)
}

// update a board name
const updateBoardName = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    const board = await Board.findById(id)

    if (!board) {
        req.status(401).json('Board not found')
    }
    //Make sure logged in user matches the board user
    if(board.user.toString() !== req.user.id) {
        res.status(401).json({error: 'User not authorized'})
    }

    const name = req.body.name

    const update = await Board.findOneAndUpdate({_id: id}, {$set:{name: name}})

    if (!update) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(update)
}

// Add a group to board
const addBoardGroup = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    const board = await Board.findById(id)

    if (!req.user) {
        req.status(401)
        throw new Error('User not found')
    }
    if (!board) {
        req.status(401)
        throw new Error('Board not found')
    }
    //Make sure logged in user matches the board user
    if(board.user.toString() !== req.user.id) {
        res.status(401)
        throw new Error('User not authorized')
    }
    const {group} = req.body
    
    console.log('The group is as follows: '+group)
    
    const update = await Board.findOneAndUpdate({_id: id}, {
        $push:{"groups": group}
    })
    if (!update) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }
    const remove = await Board.findOne({_id: id})
    remove.groupInvites.pull(group)
    remove.save()
    

    res.status(200).json(remove)
    

   
}

// REMOVE a group from board
const removeBoardGroup = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    const {group} = req.body
    
    console.log('The group is as follows: '+group)
    
    const update = await Board.findOneAndUpdate({_id: id}, {
        $pull:{"groups": group}
    })
    if (!update) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(update)
    

   
}


const updateBoardIcon = async (req, res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }
    const file = req.file
    const upload = await s3Uploadv2(file);
    const icon = upload.Key.split("/")[1]
    
    const board = await Board.findOneAndUpdate({_id: id}, {$set:{icon: icon}}) 
    if (!board) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    
    const remove = await s3delete(board.icon)
    
    
    
    res.status(200).json(remove)
}

// Send a group invitation
const sendGroupInvite = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'ID is incorrect'})
    }

    const {group} = req.body
    console.log('The group is as follows: '+group)
    const update = await Board.findOneAndUpdate({_id: id}, {
        $push:{"groupInvites": group}
    })

    if (!update) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    const invite = await Group.findOneAndUpdate({_id: group}, {
        $push:{"invitees": id}
    })

    if (!invite) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(invite)
}

// Remove a group invitation
const removeGroupInvite = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'ID is incorrect'})
    }

    const board = await Board.findById(id)

    if (!board) {
        req.status(401)
        throw new Error('Board not found')
    }

    const {group} = req.body
    const remove = await Board.findOne({_id: id})
    remove.groupInvites.pull(group)
    remove.save()

    res.status(200).json(remove)

}

// add request to target board
const sendFriendRequest = async (req, res) => {
    const {targetId} = req.params
    const {senderId} = req.body

    const update = await Board.findOneAndUpdate({_id: targetId}, {
        $push:{"friendRequests": senderId}
    })

    if (!update) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(update)  
}

// accept friend request
const addFriend = async (req, res) => {
    const { id } = req.params
    const { requestId } = req.body

    const remove = await Board.findOneAndUpdate({_id: id}, {
        $pull:{"friendRequests": requestId}
    })
    if (!remove) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    const accept = await Board.findOneAndUpdate({_id: id}, {
        $push:{"friends": requestId}
    })
    if (!accept) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }
    const reciprocate = await Board.findOneAndUpdate({_id: requestId}, {
        $push:{"friends": id}
    })
    if (!reciprocate) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(accept)  
}

// remove friend request
const declineFriend = async (req, res) => {
    const { id } = req.params
    const { requestId } = req.body

    const remove = await Board.findOneAndUpdate({_id: id}, {
        $pull:{"friendRequests": requestId}
    })
    if (!remove) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(remove)  
}

// Remove friend from my list and remove me from theirs
const unFriend = async (req, res) => {
    const { id } = req.params
    const { friendId } = req.body

    const remove = await Board.findOneAndUpdate({_id: id}, {
        $pull:{"friends": friendId}
    })
    if (!remove) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }
    const payback = await Board.findOneAndUpdate({_id: friendId}, {
        $pull:{"friends": id}
    })
    if (!payback) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    res.status(200).json(remove) 
}

// Search Boards
const searchBoards = async (req, res) => {
    const { search } = req.params
    const boards = await Board.find({name: new RegExp('^' + search, 'i')})

    res.status(200).json(boards)
}

module.exports = {
    getBoards, getBoard, deleteBoard, updateBoard, updateBoardName, addBoardGroup, removeBoardGroup, searchBoards, createBoard, updateBoardIcon, getBoardByUser, sendGroupInvite, removeGroupInvite, addFriend, declineFriend, sendFriendRequest, unFriend
}