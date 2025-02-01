import {Schema} from "mongoose";
import mongoose from "mongoose";
const TaskSchema = new Schema({
    userID:{
        type:String,
        required:true,
        ref:"User"
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description:{
        type:String,
        trim:true
    },
    type:{
        type:String,
        required:true,
        enum:["habit","adhoc"],
    },
    deadline:{
        type:Date,
        required:function(){
            return this.type === "adhoc";
        }
    },
    habitTime:{
        type: String,
        required:function(){
            return this.type === "habit"
        },
        validate:{
            validator: function (value) {
                return /^([01]\d|2[0-3]):([0-5]\d)$/.test(value);
            },
            message: "Invalid time format! Use HH:MM AM/PM",
        }
    },
    createdAt:{
        type:Date,
        default:Date.now
    }
})

export const Task = mongoose.models.Task || mongoose.model("Task",TaskSchema);