const authService = require('../services/authService');
const User = require('../models/User');
const { AppError } = require('../middleware/errorHandler');

exports.register = async (req, res, next) => {
  try {
    const { password } = req.body;
    
    // Password strength validation
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!passwordRegex.test(password)) {
      return next(new AppError('Password must be at least 8 characters long, contain an uppercase letter, a lowercase letter, a number, and a special character.', 400));
    }

    const userData = await authService.registerUser(req.body);
    res.status(201).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }
    const userData = await authService.loginUser(email, password);
    res.status(200).json({
      success: true,
      data: userData
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return next(new AppError('User not found', 404));
    
    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await authService.updateProfile(req.user._id, req.body);
    res.status(200).json({
      success: true,
      data: updatedUser
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // Placeholder
    res.status(200).json({ success: true, message: 'Password reset link sent to email (placeholder)' });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Placeholder
    res.status(200).json({ success: true, message: 'Password has been reset (placeholder)' });
  } catch (error) {
    next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.role) filter.role = req.query.role;
    const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    next(error);
  }
};
