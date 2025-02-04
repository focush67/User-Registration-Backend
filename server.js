import {config} from "dotenv";
import express from 'express';
import path from "path";
import cors from 'cors';
import {fileURLToPath} from "url";
import {connectDB} from './config/db.js';
import authRouter from './routes/authRoutes.js';
import taskRouter from "./routes/taskRoutes.js";
config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname,"client","dist")));

await connectDB();

app.use("/api/auth",authRouter);
app.use("/api/tasks",taskRouter);
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

app.listen(3000,() => {
    console.log(`Server running on port 3000`);
})