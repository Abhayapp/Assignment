import mongoose from "mongoose";
import bcrypt from "bcrypt";
import md5 from "md5";
const Model_Name = "user";

interface user {
  username: String;
  password: string;
  firstName: String;
  lastName: String;
  email: String;
  phoneNumber: Number;
  status: Number;
}

const userSchema = new mongoose.Schema<user>({
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
    // minLength: 4,
    // maxLength: 10,
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
console.log(md5("Abhay"));

//  moongoose hook post the Schema Saved
// userSchema.post('save', function (doc, next) {
//     console.log('new user was created & saved', doc);
//     next();
//   });

//Hook pre the user schema
userSchema.pre("save", async function (next) {
  //const salt = await bcrypt.genSalt();
  // const salt = 10;
  // console.log(salt);
  // this.password = await bcrypt.hash(this.password,salt)
  this.password = md5(this.password);
  console.log(this.password);
  next();
});

const user = mongoose.model<user>(Model_Name, userSchema);

export default user;
