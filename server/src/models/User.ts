import { Schema, model } from "mongoose";

// Compile-time shape (erased when TS compiles to JS)
export interface IUser {
  name: string;
  email: string;
  age: number;
  phone: string;
  address: string;
}

// Runtime rules, enforced by Mongoose before anything reaches Atlas
const submissionSchema = new Schema<IUser>(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [18, "Age must be at least 18 years old"],
      max: [120, "Age must be 120 or less"],
    },
    phone: { type: String, trim: true },
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },
  },
  { timestamps: true }, // adds createdAt and updatedAt
);

// 'Submission' becomes the 'submissions' collection in Atlas
export const Submission = model<IUser>("Submission", submissionSchema);
