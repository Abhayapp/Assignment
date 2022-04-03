import mongoose from "mongoose";
const Model_Name = "user";
import { userInterface } from "../interface/userInterface";
import encryptPassword from "../middleware/encrypt";

const userSchema = new mongoose.Schema<userInterface>(
  {
    username: {
      type: "String",
      required: true,
      unique: true,
      default: "user",
    },
    password: {
      type: "String",
      required: true,
      unique: false,
      minLength: 4,
      maxLength: 10,
    },
    firstName: {
      type: "String",
      required: true,
    },
    lastName: {
      type: "String",
      required: true,
    },
    email: {
      type: "String",
      required: true,
      unique: true,
    },
    phoneNumber: {
      type: "Number",
      required: true,
      unique: true,
    },
    status: {
      type: "Number",
      default: 1,
    },
  },
  { timestamps: true }
);

//Hook pre the user schema
userSchema.pre("save", async function (next) {
  this.password = encryptPassword(this.password);
  next();
});

const userModel = mongoose.model<userInterface>(Model_Name, userSchema);

export default userModel;
