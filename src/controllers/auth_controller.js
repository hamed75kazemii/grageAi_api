import AuthModel from "../models/auth_model.js";
import Joi from "joi";
import _ from "lodash";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import crypto from "crypto";
import { sendVerificationEmail } from "../utilities/email_service.js";

dotenv.config();

const register = async (req, res, next) => {
  try {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(50).required(),
    };
    const validateResult = Joi.object(schema).validate(req.body);
    if (validateResult.error) throw validateResult.error;

    const user = await AuthModel.getUserByEmail(req.body.email);
    if (user)
      return res.status(400).send({ message: "user already registered" });

    const sendCodeRecently = await AuthModel.sendCodeRecently(req.body.email);
    console.log(sendCodeRecently);
    if (sendCodeRecently)
      return res.status(400).send({ message: "code has been sent recently" });

    const hashPassword = await bcrypt.hash(req.body.password, 10);

    // تولید کد تأیید 6 رقمی
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    const hasUser = await AuthModel.findUserByEmail(req.body.email);
    let result;
    if (hasUser) {
      console.log("update user");
      result = await AuthModel.updateUser(
        req.body.email,

        verificationCode
      );
    } else {
      console.log("insert user");
      result = await AuthModel.inserUser(
        req.body.name,
        req.body.email,
        hashPassword,
        verificationCode
      );
    }
    console.log(result);

    // ارسال ایمیل تأیید
    try {
      await sendVerificationEmail(req.body.email, verificationCode);
    } catch (emailError) {
      console.error("Error sending verification email:", emailError);
      return res.status(500).send({
        message: "error sending verification email",
      });
    }

    res.status(201).send({
      message: "send verification code to email",
      email: req.body.email,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).send({ message: "error in registration" });
  }
};

const login = async (req, res, next) => {
  try {
    const schema = {
      email: Joi.string().email().required(),
      password: Joi.string().min(5).max(50).required(),
    };
    const validateResult = Joi.object(schema).validate(req.body);
    if (validateResult.error)
      return res
        .status(400)
        .send({ message: validateResult.error.details[0].message });

    const user = await AuthModel.getUserByEmail(req.body.email);
    if (!user) return res.status(400).send({ message: "email is invalid" });

    // بررسی تأیید ایمیل
    if (!user.email_verified) {
      return res.status(403).send({
        message: "please verify your email",
      });
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword)
      return res.status(400).send({ message: "password is invalid" });

    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    res
      .header("Authorization", accessToken)
      .header("RefreshToken", refreshToken)
      .send({
        message: "login success",
        token: accessToken,
        refreshToken: refreshToken,
      });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).send({ message: "error in login" });
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const schema = {
      email: Joi.string().email().required(),
      code: Joi.string().length(6).required(),
    };
    const validateResult = Joi.object(schema).validate(req.body);
    if (validateResult.error) {
      return res.status(400).send({
        message: validateResult.error.details[0].message,
      });
    }

    const { email, code } = req.body;

    // پیدا کردن کاربر با ایمیل
    const user = await AuthModel.getUserByVerificationToken(code);

    if (!user) {
      return res.status(400).send({ message: "user not found" });
    }

    if (user.email_verified) {
      return res.status(400).send({ message: "email already verified" });
    }

    // بررسی کد تأیید
    if (user.verification_token !== code) {
      return res.status(400).send({ message: "verification code is invalid" });
    }

    // تأیید ایمیل کاربر
    await AuthModel.verifyUserEmail(user.id);

    // صدور توکن‌های دسترسی
    const accessToken = jwt.sign(
      { id: user.id },
      process.env.ACCESS_TOKEN_SECRET,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
      }
    );
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: process.env.REFRESH_TOKEN_EXPIRES }
    );

    res
      .header("Authorization", accessToken)
      .header("RefreshToken", refreshToken)
      .send({
        message: "email verified successfully",
        user: _.pick(user, ["id", "name", "email"]),
        token: accessToken,
        refreshToken: refreshToken,
      });
  } catch (error) {
    console.error("Email verification error:", error);
    res.status(500).send({ message: "error in verify email" });
  }
};

export { register, login, verifyEmail };
