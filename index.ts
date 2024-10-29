import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connectDb";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use(express.json());

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/user", userRoutes);

// Handling GET / Request
app.get("/", (req, res) => {
  res.send("Welcome to typescript backend Server");
});

// Server setup
app.listen(PORT, () => {
  connectDB();
  console.log(
    "The application is listening " + "on port http://localhost:" + PORT
  );
});
