// src/models/user.js
import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  info: { type: String, default: "" },
  image: { type: String, default: "" }, // cloudinary url
  imageId: { type: String, default: "" }, // cloudinary public_id
});

const UserSchema = new mongoose.Schema({
  fullName: { type: String, default: "" },
  username: { type: String, required: true, unique: true }, // URL
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  resetToken: { type: String, default: null },

  portfolio: {
    // --- HOME ---
    name: { type: String, default: "" },
    bio: { type: String, default: "" },
    profileImage: { type: String, default: "" }, // cloudinary url
    profileImageId: { type: String, default: "" }, // cloudinary public_id

    // --- ABOUT ---
    info: { type: String, default: "" },

    // --- SKILLS ---
    skills: { type: [String], default: [] },

    // --- PROJECTS ---
    projects: { type: [ProjectSchema], default: [] },

    // --- BACKGROUND (choice key or url) ---
    background: { type: String, default: "" },

    // --- CONTACT ---
    contact: {
      email: { type: String, default: "" },
      phone: { type: String, default: "" },
      whatsapp: { type: String, default: "" },
      twitter: { type: String, default: "" },
      instagram: { type: String, default: "" },
      facebook: { type: String, default: "" },
    },
  },

  portfolioPublished: { type: Boolean, default: false },

  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;