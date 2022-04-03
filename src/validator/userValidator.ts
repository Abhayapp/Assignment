import { Request, Response, NextFunction } from "express";
import { check, validationResult } from "express-validator";
const userSignupValidator = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 4 })
    .withMessage("Password must be more than 4 charecters")
    .isLength({ max: 10 })
    .withMessage("Password must be less than 10 charecters"),
  check("firstName")
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("lastName")
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("email")
    .not()
    .isEmpty()
    .withMessage("Invalid email address!")
    .isEmail()
    .withMessage("Please enter a valid email address"),
  check("phoneNumber")
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .isLength({ min: 10 })
    .withMessage("Please enter a valid phone number")
    .isLength({ max: 10 })
    .withMessage("Please enter a valid phone number"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(402).json({ errors: errors.array() });
    next();
  },
];

const userLoginValidator = [
  check("username")
    .not()
    .isEmpty()
    .withMessage("User name can not be empty!")
    .isLength({ min: 3 })
    .withMessage("Minimum 3 characters required!"),
  check("password")
    .not()
    .isEmpty()
    .withMessage("Password cannot be empty")
    .isLength({ min: 4 })
    .withMessage("Please enter a valid password!")
    .isLength({ max: 10 })
    .withMessage("Please enter a valid password!"),
  (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(402).json({ errors: errors.array() });
    next();
  },
];

export { userSignupValidator, userLoginValidator };
