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

export default taskRouter;