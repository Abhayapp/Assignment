import { Request, Response } from "express";
import userModel from "../model/user";
import { userData, decodedTokenInterface } from "../interface/userInterface";
import createToken from "../middleware/jwtSign";
import encryptPassword from "../middleware/encrypt";

// use of multer for image and file uploading
import multer from "multer";
import imageModel from "../model/imageModel";
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req: Request, file: any, cb) => {
    cb(null, file.originalname);
    console.log(file.originalname);
  },
});

const upload = multer({
  storage: storage,
}).single("Image");

const uploadImage = async (req: Request, res: Response) => {
  upload(req, res, (err: any) => {
    if (err) {
      console.log(err);
      res.json({ err: "error" });
    } else {
      const newImage = new imageModel({
        name: req.body.name,
        image: {
          data: req.file?.filename,
          contentType: "image/png/pdf/xls/jpg/otherfiles",
        },
      });
      newImage
        .save()
        .then(() =>
          res.json({
            success: 1,
            imageName: `${req.file?.filename}`,
          })
        )
        .catch((err: any) => console.log(err));
      console.log(newImage);
    }
  });
};
//==========================================//

const signUp = async (req: Request, res: Response): Promise<Response> => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    status,
  }: userData = req.body;

  const existUser = await userModel.findOne({ username: username });
  if (existUser) {
    return res.json({ message: "user already signedup" });
  }

  const User = new userModel({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    status: status,
  });
  const data = await User.save();

  const token = createToken(data._id);
  return res
    .status(201)
    .json({ message: "Signedup successfully", user: data, token });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const data = await userModel.findOne({ username: username, status: 1 });

  if (data) {
    const passEncrypt = encryptPassword(password);
    const passwordObj = await userModel.findOne({ password: data.password });
    const userPassword = passwordObj?.password;
    if (passEncrypt === userPassword) {
      const token = createToken(data._id);
      res
        .status(200)
        .json({ message: "Data logged in successfully", data, token });
    } else {
      res.status(400).json({ message: "Password does not match!" });
    }
  } else {
    res.status(404).json({ message: "Incorrect usernmae or inactive status" });
  }
};

const authUser = async (req: Request, res: Response) => {
  const decodedToken = req.body.decodedToken;
  res.json({ message: "Authorised user", decodedToken });
};

const getProfile = async (req: Request, res: Response) => {
  const decodedToken = req.body.decodedToken;
  const User = await userModel.findOne({ _id: decodedToken.id });
  res.json({ message: "Profile", userprofile: User });
};

const update = async (req: Request, res: Response) => {
  const decodedToken = req.body.decodedToken;
  if (req.body.password === undefined) {
    const data = await userModel.updateOne(
      { _id: decodedToken.id },
      { $set: req.body }
    );
    res.json({ UserProfile: "Profile updated" });
  } else {
    const hashPass = encryptPassword(req.body.password);

    const data = await userModel.updateOne(
      { _id: decodedToken.id },
      { $set: req.body }
    );
    const Data = await userModel.updateOne(
      { _id: decodedToken.id },
      { $set: { password: hashPass } }
    );
    res.json({ userprofile: "Profile updated" });
  }
};

const del = async (req: Request, res: Response) => {
  const decodedToken = req.body.decodedToken;
  const data = await userModel.findOneAndDelete({ _id: decodedToken.id });
  if (data) {
    res.json({ message: "data deleted" });
  } else {
    res.json({ message: "user data not found" });
  }
};

const deActivate = async (req: Request, res: Response) => {
  const decodedToken = req.body.decodedToken;
  const data = await userModel.findOneAndUpdate(
    { _id: decodedToken.id, status: 1 },
    { $set: { status: 0 } }
  );
  if (data) {
    res.json({ message: "User deactivated" });
  } else {
    res.json({ message: "user already deactivated" });
  }
};

const reActivate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = await userModel.findOne({ username: username, status: 0 });
  if (data) {
    const passEncrypt = encryptPassword(password);
    const passwordObj = await userModel.findOne({ password: data.password });
    const userPassword = passwordObj?.password;

    if (passEncrypt === userPassword) {
      const token = createToken(data._id);
      const data1 = await userModel.updateOne(
        { _id: data._id },
        { $set: { status: 1 } }
      );
      res.json({ message: "Reactivated successfully", token });
    } else {
      res.json({ message: "Password does not match!" });
    }
  } else {
    res.json({ message: "invalid credentials or already active status" });
  }
};

export default {
  signUp,
  login,
  authUser,
  update,
  getProfile,
  del,
  deActivate,
  reActivate,
  uploadImage,
};
