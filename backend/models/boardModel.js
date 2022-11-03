const mongoose = require('mongoose')
const Schema = mongoose.Schema

const boardSchema = new Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    type: {
        type: String,
        required: false
    },
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String,
        required: false
    },
    schedule: {
        type: Object,
        required: true
    },
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Group'
    }],
    adminGroups: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Group'
    }],
    friends: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Board'
    }],
    groupInvites: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Group'
    }],
    friendRequests: [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'Board'
    }]
})



module.exports = mongoose.model('Board', boardSchema)
