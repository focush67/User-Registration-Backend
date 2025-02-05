import {User} from "../models/User.js";
import {Task} from "../models/Task.js";
import {config} from "dotenv";
import {Router} from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
config();

const taskRouter = Router();

taskRouter.get("/",authMiddleware,async(req,res) => {
    try{
        const tasks = await Task.find({userID: req.user.id});
        res.status(200).json(tasks);
    }catch(error){
        res.status(500).json({
            message:`Server error in getting tasks`,
            error: error
        })
    }
})

taskRouter.post("/",authMiddleware,async(req,res) => {
    try{
        const {title,description,type,deadline,habitTime} = req.body;
        const newTask = new Task({
            userID: req.user.id,
            title,
            description,
            type,
            deadline: type === "adhoc" ? deadline : undefined,
            habitTime: type === "habit" ? habitTime : undefined
        });
        await newTask.save();
        res.status(201).json({
            message:`New Task added as ${type} : ${title}`
        })
    }catch(error){
        res.status(500).json({
            message:`Server error im creating task`,
            error: error
        })
    }
})

taskRouter.delete("/:id",authMiddleware,async(req,res) => {
    try{
        const taskID = req.params.id;
        const userID = req.user.id;
        console.log(req.user)
        const task = await Task.findOne({_id: taskID,userID:userID});
        if(!task){
            return res.status(404).json({message:`Task not found for user ${userID}`})
        }
        await Task.findByIdAndDelete(taskID);
        res.status(200).json({message:`Task ${taskID} deleted successfully`});
    }catch(error){
        console.log(`Error in delete route in taskRouter`,error);
        res.status(500).json({message:`Server error in deleting task`})
    }
})

taskRouter.patch("/:id",authMiddleware,async(req,res) => {
    try{
        const {id} = req.params;
        const {title,description,type,deadline,habitTime} = req.body;
        const updatedTask = await Task.findByIdAndUpdate({_id: id,userID: req.user.id},{title,description,type,deadline,habitTime},{new:true,runValidators:true});

        if(!updatedTask){
            return res.status(404).json({
                message:"No Task Found to Update"
            })
        }
        res.status(201).json({
            message:`Task Updated Successfuly`,
            task:updatedTask._id
        })
    }catch(error){
        console.error(`Error in patch route in taskRouter`,error);
        res.status(500).json({
        message:`Error inside patch in taskRouter`
        })
    }
})

export default taskRouter;