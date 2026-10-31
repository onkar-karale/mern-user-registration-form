import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import submissionRoutes from "./routes/userRoutes";

const app = express();

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  const connected = mongoose.connection.readyState === 1;
  res
    .status(connected ? 200 : 503)
    .json({ database: connected ? "connected" : "not connected" });
});

app.use("/api/submissions", submissionRoutes);

export default app;
