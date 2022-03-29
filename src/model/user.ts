import mongoose from "mongoose";
import md5 from "md5";
const Model_Name = "user";
import userInterface from "../interface/userInterface";

const userSchema = new mongoose.Schema<userInterface>({
  username: {
    type: "String",
    required: true,
    unique: true,
    default: "user",
  },
  password: {
    type: String,
    required: true,
    unique: true,
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
    default: 0,
  },
});

//Hook pre the user schema
userSchema.pre("save", async function (next) {
  this.password = md5(this.password);
  //console.log(this.password);
  next();
});

const user = mongoose.model<userInterface>(Model_Name, userSchema);

export default user;
