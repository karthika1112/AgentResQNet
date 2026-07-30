const User = require('../models/User');
const generateToken = require('../utils/generateToken');
const { AppError } = require('../middleware/errorHandler');

const registerUser = async (userData) => {
  const { name, email, password, phone, role } = userData;

  const userExists = await User.findOne({ email });
  if (userExists) {
    throw new AppError('User already exists', 400);
  }

  // Determine role, prevent users from registering as Admin
  let assignedRole = 'Victim';
  if (role && ['Victim', 'Volunteer', 'Responder'].includes(role)) {
    assignedRole = role;
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
    role: assignedRole
  });

  if (user) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new AppError('Invalid user data', 400);
  }
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    };
  } else {
    throw new AppError('Invalid email or password', 401);
  }
};

const updateProfile = async (userId, data) => {
  const user = await User.findById(userId);

  if (user) {
    user.name = data.name || user.name;
    user.phone = data.phone || user.phone;

    if (data.password) {
      user.password = data.password;
    }

    const updatedUser = await user.save();

    return {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
      token: generateToken(updatedUser._id),
    };
  } else {
    throw new AppError('User not found', 404);
  }
};

module.exports = {
  registerUser,
  loginUser,
  updateProfile
};
