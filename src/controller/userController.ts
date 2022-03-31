import { Request, Response } from "express";
import userModel from "../model/user";
import jwt from "jsonwebtoken";
import md5 from "md5";

const jwtSecretKey = String(process.env.JWTSECRETKEY);

const session = 3 * 24 * 60 * 60;
const createToken = (id: object) => {
  return jwt.sign({ id }, jwtSecretKey, { expiresIn: session });
};

const signUp = async (req: Request, res: Response) => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    status,
  } = req.body;

  const check = await userModel.findOne({ username: username });
  if (check) {
    return res.json({ message: "user already logged in" });
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
  res.status(201).json({ message: "Signedup successfully", user: data, token });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const data = await userModel.findOne({ username: username, status: 1 });

  if (data) {
    const passEncrypt = md5(password);
    const passwordDb = await userModel.findOne({ password: data.password });
    const dataPass = passwordDb?.password;

    if (passEncrypt === dataPass) {
      const token = createToken(data._id);
      res.json({ message: "Data logged in successfully", data, token });
    } else {
      res.json({ message: "Password does not match!" });
    }
  } else {
    res.json({ message: "Incorrect usernmae or inactive status" });
  }
};

const authUser = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, jwtSecretKey, (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      res.json({ error: "error Occured" });
    } else {
      res.json({ message: "Authorised user", decodedToken });
    }
  });
};

const getProfile = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, jwtSecretKey, async (err, decodedToken: any) => {
    if (err) {
      res.json({ message: "log in again" });
    } else {
      const decode = decodedToken.id;
      const User = await userModel.findOne({ _id: decode });
      res.json({ userprofile: User });
    }
  });
};

const update = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, jwtSecretKey, async (err, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in again" });
    } else {
      const decode = decodedToken.id;
      if (req.body.password === undefined) {
        const data = await userModel.updateOne(
          { _id: decodedToken.id },
          { $set: req.body }
        );
        res.json({ UserProfile: "Profile updated" });
      } else {
        const hashpass = md5(req.body.password);

        const data = await userModel.updateOne(
          { _id: decodedToken.id },
          { $set: req.body }
        );
        const Data = await userModel.updateOne(
          { _id: decodedToken.id },
          { $set: { password: hashpass } }
        );

        res.json({ userprofile: "Profile updated" });
      }
    }
  });
};

const del = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, jwtSecretKey, async (err, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in again" });
    } else {
      const decode = decodedToken.id;
      const data = await userModel.deleteOne({ _id: decodedToken.id });
      res.json({ message: "data deleted" });
    }
  });
};

const deActivate = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, jwtSecretKey, async (err, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in again" });
    } else {
      //const decode = decodedToken.id;
      const data = await userModel.updateOne(
        { _id: decodedToken.id },
        { $set: { status: 0 } }
      );
      res.json({ message: "User deactivated" });
    }
  });
};

const reActivate = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = await userModel.findOne({ username: username, status: 0 });
  console.log(data);

  if (data) {
    const passmatch: any = md5(password);
    console.log(passmatch);
    const datapass = await userModel.findOne({ password: data.password });
    console.log(datapass?.password);
    const dataPass = datapass?.password;

    if (passmatch === dataPass) {
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
    res.json({ message: "Incorrect username or already active status" });
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
};
