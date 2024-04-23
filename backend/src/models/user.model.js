import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
const colors = [
   "#0dd37c",
   "#00477e",
   "#e11656",
   "#4c8c75",
   "#082e44",
   "#fe914b",
   "#28a4d3",
   "#879ce8",
   "#fa4682",
   "#be2d09",
];
function getRandomColor() {
   const randomIndex = Math.floor(Math.random() * colors.length);
   return colors[randomIndex];
}

const randomColor = getRandomColor();
const userSchema = new Schema(
   {
      email: {
         type: String,
         required: true,
         unique: true,
         lowercase: true,
         trim: true,
      },
      fullName: {
         type: String,
         required: true,
         trim: true,
      },
      bio: {
         type: String,
         default: "Hey, I am using BatChit.site!",
      },

      refreshToken: {
         type: String,
      },
      background: {
         type: String,
         default: randomColor,
      },
      gender: {
         type: Number,
         required: true,
         enum: [0, 1, 2], // 1 for male, 2 for female and 0 for prefer not to say
      },
      isActivated: {
         type: Boolean,
         default: false,
      },
      password: {
         type: String,
         required: [true, "Password is required"],
      },
      activationToken: {
         type: String,
      },
      isAdmin: {
         type: Boolean,
         default: false,
      },
      lastSeen: {
         type: Date,
         default: Date.now(),
      },
      isOnline: {
         type: Boolean,
         default: false,
      },
   },
   {
      timestamps: true,
   }
);

userSchema.pre("save", async function (next) {
   if (!this.isModified("password")) return next();

   this.password = await bcrypt.hash(this.password, 10);
   next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
   return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
         fullName: this.fullName,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};

userSchema.methods.generateAccountActivationToken = function () {
   return jwt.sign(
      {
         _id: this._id,
         email: this.email,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
         expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
      }
   );
};

userSchema.methods.generateRefreshToken = function () {
   return jwt.sign(
      {
         _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
         expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
      }
   );
};

export const User = mongoose.model("User", userSchema);
