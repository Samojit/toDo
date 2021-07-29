const mongoose = require('mongoose');
const reg = require('./model')
var Schema = mongoose.Schema;

const taskSchema = new mongoose.Schema({
    // name:{
    //     type:String,
    //     required:true
    // },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user_id:{
      type: Schema.Types.ObjectId, 
      ref: 'reg'
    }
});


const Todo = mongoose.model('Todo', taskSchema);
module.exports = Todo;