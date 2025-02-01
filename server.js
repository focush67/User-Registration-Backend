import {config} from "dotenv";
import express from 'express';
import cors from 'cors';
import {connectDB} from './config/db.js';
import authRouter from './routes/authRoutes.js';
import taskRouter from "./routes/taskRoutes.js";
config();
const app = express();
app.use(express.json());
app.use(cors());

await connectDB();

app.use("/api/auth",authRouter);
app.use("/api/tasks",taskRouter);
app.listen(3000,() => {
    console.log(`Server running on port 3000`);
})