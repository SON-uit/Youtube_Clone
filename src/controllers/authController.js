const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const axios = require("axios");

const User = require("../models/userModel");
const catchAsync = require("../helpers/catchAsync");
const AppError = require("../helpers/appError");

class AuthController {
  // signToken
  signToken = (id) => {
    if (process.env.JWT_TOKEN_SECRET && process.env.JWT_EXPIRES_IN) {
      return jwt.sign({ id: id }, process.env.JWT_TOKEN_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN,
      });
    }
  };

  // response token to client
  sendJWTtoken = (res, user, statusCode) => {
    const cookieOption = {
      expires: new Date(Date.now() + 3 * 3600 * 24 * 1000),
      httpOnly: true,
    };
    const token = this.signToken(user._id);
    res.cookie("jwt", token, cookieOption);
    return res.status(statusCode).json({
      status: "Success",
    });
  };

  //signUp
  signUp = catchAsync(async (req, res, next) => {
    //get data from client
    const { firstName, lastName, email, password } = req.body;
    const data = {
      client_id: process.env.AUTH0_CLIENT_ID,
      connection: process.env.AUTH0_CONNECTION,
      email: email,
      password: password,
      given_name: firstName,
      family_name: lastName,
    };
    try {
      // request to auth0
      const response = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_DOMAIN}/dbconnections/signup`,
        headers: { "content-type": "application/json" },
        data,
      });
      // check user already exist
      if (!response.data) {
        return next(new AppError("User already existed", 404));
      }
      // store user data in DB
      const newUser = await User.create({
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        email: response.data.email,
        userName: `${response.data.given_name} ${response.data.family_name}`,
      });
      //return jwt token
      this.sendJWTtoken(res, newUser, 200);
    } catch (err) {
      return next(
        new AppError(
          err.response.data.message ||
            err.response.data.error ||
            "User already exists",
          400
        )
      );
    }
  });

  //signIn
  signIn = catchAsync(async (req, res, next) => {
    //get data from client
    const { email, password } = req.body;
    //config options in axios
    const data = new URLSearchParams({
      client_id: process.env.AUTH0_CLIENT_ID,
      realm: process.env.AUTH0_CONNECTION,
      grant_type: "http://auth0.com/oauth/grant-type/password-realm",
      username: email,
      password: password,
      scope: "openid email offline_access",
    });
    try {
      //request to auth0 login api
      const response = await axios({
        method: "POST",
        url: `https://${process.env.AUTH0_DOMAIN}/oauth/token`,
        data: data,
      });
      if (response.status === 200) {
        //check user verified accountt
        const resToAuth0 = await axios({
          method: "GET",
          url: `https://${process.env.AUTH0_DOMAIN}/userinfo`,
          headers: {
            Authorization: `Bearer ${response.data.access_token}`,
          },
        });
        if (!resToAuth0.data.email_verified) {
          return res.status(400).json({
            status: "Failed",
            message: "Check Email Verify Your Account",
          });
        }
        const user = await User.findOne({ email: resToAuth0.data.email });
        //check if user exists
        if (!user) {
          return res.status(404).json({
            status: "Failed",
            message: "User not exsists",
          });
        }
        //not exsist user
        if (!user.isActive) {
          return next(new AppError("User Not Active", 400));
        }
        //send JWT Token to Client
        this.sendJWTtoken(res, user, 200);
      }
    } catch (err) {
      return next(
        new AppError("Invaid Input or Password", err.response.status)
      );
    }
  });

  //checkAuth
  checkIsAuth = catchAsync(async (req, res, next) => {
    //get jwt token from cookies
    const token = req.cookies.jwt;
    if (!token) {
      return res.redirect("/sign-in");
    }
    try {
      //verify token
      const decoded = await promisify(jwt.verify)(
        token,
        process.env.JWT_TOKEN_SECRET
      );
      const currentUser = await User.findOne({ _id: decoded.id });
      if (!currentUser) {
        return next(
          new AppError("Invaid Input or Password", err.response.status)
        );
      }
      // set local variable
      res.locals.user = currentUser;
      req.user = currentUser;
      next();
    } catch {
      return res.redirect("/sign-in");
    }
  });

  //logout
  logout = catchAsync(async (req, res, next) => {
    // return token with null value
    res.cookie("jwt", null, {
      expires: new Date(Date.now() + 5 * 1000),
      httpOnly: true,
    });
    return res.redirect("/sign-in");
  });
}

module.exports = new AuthController();
