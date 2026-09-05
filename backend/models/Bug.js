import mongoose from "mongoose";

const bugSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      required: true,
      unique: true,
      index: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      minlength: [1, "Title cannot be empty"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },
    description: { type: String, default: "", trim: true },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      default: "Low",
    },
    severity: {
      type: String,
      enum: ["Minor", "Major", "Critical"],
      default: "Minor",
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved"],
      default: "Open",
    },
    assignedTo: { type: String, default: "", trim: true },
    steps: { type: String, default: "", trim: true },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Bug", bugSchema);
