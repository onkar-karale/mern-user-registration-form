import { Request, Response } from "express";
import mongoose from "mongoose";
import { IUser, Submission } from "../models/User";

// POST /api/submissions: save one form entry
export const createSubmission = async (
  req: Request<{}, {}, IUser>, // 3rd generic types req.body
  res: Response,
): Promise<void> => {
  try {
    // Fields not in the schema are silently dropped, so users can't inject extra data
    const submission = await Submission.create(req.body);
    res.status(201).json(submission); // 201 = Created
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(400).json({ error: err.message }); // a schema rule was broken
      return;
    }
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/submissions: list entries, newest first
export const getSubmissions = async (
  _req: Request,
  res: Response,
): Promise<void> => {
  try {
    const submissions = await Submission.find().sort({ createdAt: -1 });
    res.json(submissions);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
