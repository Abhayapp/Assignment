import { Request, Response, NextFunction } from "express";
import user from "../model/user";
import jwt from "jsonwebtoken";
import md5 from "md5";
import bcrypt from "bcrypt";
import mosca from "mosca";
const setting = {
  port: 1883,
};

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

  const user1 = new user({
    username: username,
    password: password,
    firstName: firstName,
    lastName: lastName,
    email: email,
    phoneNumber: phoneNumber,
    status: status,
  });
  const data = await user1.save();

  const token = createToken(data._id);
  // res.cookie('jwt', token, { httpOnly: true, maxAge: session * 1000 });
  res.status(201).json({ Message: "SignedUp Successfully", user: data, token });
};

const login = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  const data = await user.findOne({ username: username, status: 1 });
  //console.log(data);

  if (data) {
    //const salt = await bcrypt.genSalt();
    // const salt =10;
    // const pass = data.password;
    // const passmatch= await bcrypt.compare(password,pass);
    const passmatch: any = md5(password);
    console.log(passmatch);
    const datapass = await user.findOne({ password: data.password });
    console.log(datapass?.password);
    const datapass1 = datapass?.password;

    //if(passmatch===true)
    if (passmatch === datapass1) {
      const token = createToken(data._id);
      //res.cookie('jwt', token, { httpOnly: true, maxAge: session * 1000 });
      res.json({ Message: "Data Logged In Successfully", data, token });
    } else {
      res.json({ Message: "password Does Not Match!" });
    }
  } else {
    res.json({ Message: "Incorrect USERNAME OR InActive Status" });
  }
};

const authuser = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", (err: any, decodedToken: any) => {
    if (err) {
      console.log(err.message);
      res.json({ Error: "error Occured" });
    } else {
      console.log(decodedToken);
      //res.json(JSON.stringify(decodedToken));
      res.json({ Message: "Authorised User", decodedToken });
    }
  });
};

const getprofile = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err: any, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in Again" });
    } else {
      const decode = decodedToken.id;
      const userr = await user.findOne({ _id: decode });
      res.json({ UserProfile: userr });
    }
  });
};

const update = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err: any, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in Again" });
    } else {
      const decode = decodedToken.id;
      //console.log(req.body.password);
      if (req.body.password === undefined) {
        const data = await user.updateOne(
          { _id: decodedToken.id },
          { $set: req.body }
        );
        res.json({ UserProfile: "Profile Updated" });
      } else {
        const hashpass = md5(req.body.password);
        // console.log(hashpass);
        const data = await user.updateOne(
          { _id: decodedToken.id },
          { $set: req.body }
        );
        const data1 = await user.updateOne(
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
  jwt.verify(`${token}`, "secret", async (err: any, decodedToken: any) => {
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

const reactive = async (req: Request, res: Response, next: NextFunction) => {
  const { username, password } = req.body;
  const data = await user.findOne({ username: username, status: 0 });
  console.log(data);

  if (data) {
    const passmatch: any = md5(password);
    console.log(passmatch);
    const datapass = await user.findOne({ password: data.password });
    console.log(datapass?.password);
    const datapass1 = datapass?.password;

    if (passmatch === datapass1) {
      const token = createToken(data._id);
      const data1 = await user.updateOne(
        { _id: data._id },
        { $set: { status: 1 } }
      );
      res.json({ Message: "reactivated Successfully", token });
    } else {
      res.send("password Does Not Match!");
    }
  } else {
    res.send("Incorrect USERNAME OR Already Active Status");
  }
};

const mqserver = async (req: Request, res: Response) => {
  const token = req.headers["authorization"];
  jwt.verify(`${token}`, "secret", async (err: any, decodedToken: any) => {
    if (err) {
      res.json({ Message: "log in Again,Your Token Expired" });
    } else {
      var server = new mosca.Server(setting);

      server.on("ready", function () {
        console.log("ready");
      });

      server.on("clientConnected", function (client: any) {
        console.log("New connection: ", client.id);
      });
    }
  });

  res.json({ Message: "Mqtt Server Connected" });
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
  mqserver,
};

//
