import jwt from 'jsonwebtoken';
// import asyncHandler from 'express-async-handler';
import User from '../models/UsersModel.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      // res.status(401);
      return res.status(401).json({ message: "Not authorized, token failed", error: error })
      console.log(error)
      // throw new Error('Not authorized, token failed');
    }
  }

  if (!token) {

    return res.status(403).json({ message: "Authorization denied, please login" });
  }
};


export const adminAuth = (req, res, next) => {
  const { userType } = req.user;

  if (userType !== "Admin") {
    return res.status(401).json({ message: "Authorization denied, only Admins" });
  } else {
    next();
  }
};

export const managerAuth = (req, res, next) => {
  const { userType } = req.user;

  if (userType !== "Manager") {
    return res.status(401).json({ message: "Authorization denied, only Managers" });
  } else {
    next();
  }
};