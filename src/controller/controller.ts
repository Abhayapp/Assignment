import { Request, Response } from "express";
import user from "../model/user";
import jwt from "jsonwebtoken";
import md5 from "md5";

const session = 3 * 24 * 60 * 60;
const createToken = (id: object) => {
  return jwt.sign({ id }, "secret", { expiresIn: session });
};

const signup = async (req: Request, res: Response) => {
  const {
    username,
    password,
    firstName,
    lastName,
    email,
    phoneNumber,
    status,
  } = req.body;

  const check: any = await user.findOne({ username: username });
  if (check) {
    return res.json({ Message: "user Already Logged In!" });
  }

  const User = new user({
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
  res.status(201).json({ Message: "SignedUp Successfully", user: data, token });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const data = await user.findOne({ username: username, status: 1 });

  if (data) {
    const passMatch = md5(password);
    const datapass = await user.findOne({ password: data.password });
    const dataPass = datapass?.password;

    if (passMatch === dataPass) {
      const token = createToken(data._id);
      res.json({ Message: "Data Logged In Successfully", data, token });
    } else {
      res.json({ Message: "password Does Not Match!" });
    }
  } else {
    res.json({ Message: "Incorrect USERNAME OR InActive Status" });
  }
};

const authuser = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", (err, decodedToken) => {
    if (err) {
      console.log(err.message);
      res.json({ Error: "error Occured" });
    } else {
      res.json({ Message: "Authorised User", decodedToken });
    }
  });
};

const getprofile = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in Again" });
    } else {
      const decode = decodedToken.id;
      const User = await user.findOne({ _id: decode });
      res.json({ UserProfile: User });
    }
  });
};

const update = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err, decodedToken:any) => {
    if (err) {
      res.json({ Message: "log in Again" });
    } else {
      const decode = decodedToken.id;
      if (req.body.password === undefined) {
        const data = await user.updateOne(
          { _id: decodedToken.id },
          { $set: req.body }
        );
        res.json({ UserProfile: "Profile Updated" });
      } else {
        const hashpass = md5(req.body.password);

        const data = await user.updateOne(
          { _id: decodedToken.id },
          { $set: req.body }
        );
        const Data = await user.updateOne(
          { _id: decodedToken.id },
          { $set: { password: hashpass } }
        );

        res.json({ UserProfile: "Profile Updated" });
      }
    }
  });
};

const del = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err: any, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in Again" });
    } else {
      const decode = decodedToken.id;
      const data = await user.deleteOne({ _id: decodedToken.id });
      res.json({ Message: "data Deleted" });
    }
  });
};

const deactivate = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in Again" });
    } else {
      const decode = decodedToken.id;
      const data = await user.updateOne(
        { _id: decodedToken.id },
        { $set: { status: 0 } }
      );
      res.json({ Message: "User Deactivated" });
    }
  });
};

const reactive = async (req: Request, res: Response) => {
  const { username, password } = req.body;
  const data = await user.findOne({ username: username, status: 0 });
  console.log(data);

  if (data) {
    const passmatch: any = md5(password);
    console.log(passmatch);
    const datapass = await user.findOne({ password: data.password });
    console.log(datapass?.password);
    const dataPass = datapass?.password;

    if (passmatch === dataPass) {
      const token = createToken(data._id);
      const data1 = await user.updateOne(
        { _id: data._id },
        { $set: { status: 1 } }
      );
      res.json({ Message: "reactivated Successfully", token });
    } else {
      res.json({Message:"password Does Not Match!"});
    }
  } else {
    res.json({Message:"Incorrect USERNAME OR Already Active Status"});
  }
};

export default {
  signup,
  login,
  authuser,
  update,
  getprofile,
  del,
  deactivate,
  reactive,
};
