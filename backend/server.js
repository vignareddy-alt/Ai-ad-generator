import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import imageRoutes from "./routes/image.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/image", imageRoutes);

app.listen(5000, () => {
  console.log("Server running on port 5000");
});