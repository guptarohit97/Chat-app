import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials:true
  })
);

app.use("/api/auth", authRoutes);
app.use("/api/message", messageRoutes);
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log("App is running at:" + PORT);
  connectDB();
});
