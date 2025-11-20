// src/models/portfolio.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  info: { type: String, default: "" },
  image: { type: String, default: "" },
  imageId: { type: String, default: "" },
});

const ContactSchema = new mongoose.Schema({
  email: String,
  phone: String,
  whatsapp: String,
  twitter: String,
  instagram: String,
  facebook: String,
});

const PortfolioSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", unique: true },
    username: { type: String, required: true, lowercase: true },

    name: { type: String, default: "" },
    bio: { type: String, default: "" },

    profileImage: {
      url: { type: String, default: "" },
      public_id: { type: String, default: "" },
    },

    aboutInfo: { type: String, default: "" },
    skills: { type: [String], default: [] },
    projects: { type: [ProjectSchema], default: [] },

    contact: { type: ContactSchema, default: {} },

    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Portfolio ||
  mongoose.model("Portfolio", PortfolioSchema);