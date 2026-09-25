import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, maxlength: 200 },
  topic: { type: String, required: true, trim: true, maxlength: 80 },
  message: { type: String, required: true, trim: true, maxlength: 4000 },
  status: { type: String, enum: ["new", "read", "archived"], default: "new", index: true }
}, { timestamps: true });

export default mongoose.model("ContactMessage", contactMessageSchema);
