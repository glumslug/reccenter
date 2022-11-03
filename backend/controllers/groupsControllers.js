const Group = require('../models/groupModel')
const Board = require('../models/boardModel')
const mongoose = require('mongoose')
const { s3Uploadv2, s3delete } = require('../s3service')


// get all Groups
const getGroups = async (req, res) => {
    const groups = await Group.find({}).sort({name: 1})

    res.status(200).json(groups)
}

// get a single Group
const getGroup = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    const group = await Group.findById(id)

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    res.status(200).json(group)
} 

// add board to Group
const addMember = async (groupId, boardId) => {

    const board = await Board.findOneAndUpdate({_id: boardId}, {
        $push: {
            "groups": groupId
        }
    })
    const admin = await Board.findOneAndUpdate({_id: boardId}, {
        $push: {
            "adminGroups": groupId
        }
    })

}

// add board to Group
const manageAdmins = async (req, res) => {
    const {groupId} = req.params
    const {boardId, action} = req.body

    if(action==='add'){
        const board = await Board.findOneAndUpdate({_id: boardId}, {
            $push: {
                "adminGroups": groupId
            }
        })
        const group = await Group.findOneAndUpdate({_id: groupId}, {
            $push: {
                "admins": boardId
            }
        })
        res.status(200).json(group)
    }
    if(action==='remove'){
        const board = await Board.findOneAndUpdate({_id: boardId}, {
            $pull: {
                "adminGroups": groupId
            }
        })
        const group = await Group.findOneAndUpdate({_id: groupId}, {
            $pull: {
                "admins": boardId
            }
        })
        res.status(200).json(group)
    }
    


}

// create new Group
const createGroup = async (req, res) => {
    const {name, activities, privacy, members, admins} = req.body
    const file = req.file
    const upload = file ? await s3Uploadv2(file) : null
    const icon = upload ? upload.Key.split("/")[1] : 'user-solid.svg'
    // add doc to db
    try{
        const group = await Group.create({name, activities, privacy, icon, members, admins})
        const groupId = (group._id.toString())
        const boardId = admins
        
        addMember(groupId, boardId).then(res.status(200).json(group))
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
    
    
}

// delete a Group
const deleteGroup = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    const group = await Group.findOneAndDelete({_id: id})

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    await s3delete(group.icon)
    Promise.all(group.invitees.map((invitee)=>Board.findOneAndUpdate({_id: invitee}, {
        $pull:{"groupInvites": id}})))

    res.status(200).json('Group deleted')

}

// update a Group
const updateGroup = async (req, res) => {
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    const group = await Group.findOneAndUpdate({_id: id}, {
        ...req.body
    })

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    res.status(200).json(group)
}

//Remove a group member
const removeMember = async (req, res) => {
    const { id } = req.params
    const {member}= req.body
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    
    const group = await Group.findById(id)
    group.members.pull(member)
    group.save()
    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    
    const board = await Board.findById(member)
    board.groups.pull(id)
    board.save()
    if (!board) {
        return res.status(404).json({error: 'Board doesn\'t exist'})
    }

    return res.status(200).json(board)
    
}

const updateGroupMembers = async (req, res) => {
    const { id, member } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    
    const group = await Group.findOneAndUpdate({_id: id}, {
        
        $push: { "members": member }
    })

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    res.status(200).json(group)
}

const updateGroupIcon = async (req, res) =>{
    const { id } = req.params
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    const file = req.file
    const upload = await s3Uploadv2(file);
    const icon = upload.Key.split("/")[1]
    const group = await Group.findOneAndUpdate({_id: id}, {$set:{icon: icon}})

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    const remove = await s3delete(group.icon)
    
    res.status(200).json(remove)
}

// search Groups
const searchGroups = async (req, res) => {
    const { search } = req.params
    const groups = await Group.find({name: new RegExp('^' + search, 'i')})

    res.status(200).json(groups)
}

const sendGroupRequest = async (req, res) => {
    const { id } = req.params
    const { person } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    
    const group = await Group.findOneAndUpdate({_id: id}, {
        
        $push: { "requests": person }
    })

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    res.status(200).json(group)
}

const manageGroupRequest = async (req, res) => {
    const { id } = req.params
    const { person, accept } = req.body
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    if(accept){
    const group = await Group.findOneAndUpdate({_id: id}, {
        
        $push: { "members": person }
    })

    if (!group) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }
    const board = await Board.findOneAndUpdate({_id: person}, {
        
        $push: { "groups": id }
    })

    if (!board) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    }

    const request = await Group.findOneAndUpdate({_id: id}, {
        
        $pull: { "requests": person }
    })

    if (!request) {
        return res.status(404).json({error: 'Group doesn\'t exist'})
    }

    res.status(200).json(request)
}

module.exports = {
    createGroup, getGroups, getGroup, deleteGroup, updateGroup, searchGroups, updateGroupMembers, removeMember, updateGroupIcon, manageGroupRequest, sendGroupRequest, manageAdmins
}