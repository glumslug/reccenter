const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Board = require("../models/boardModel");
const { forgotPasswordHtml } = require("../templates/email.jsx");

//@desc Register new user
//@route POST api/users
//@access Public
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(404).json("Please add all fields");
  }

  //Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400).json("User already exists");
  }

  //Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  //Create user
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    boards: [],
  });
  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      boards: [],
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

//@desc Authenticate a user
//@route POST api/users/login
//@access Public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  //Check for user email
  const user = await User.findOne({ email }).populate({
    path: "boards",
    select: "_id name icon groups groupInvites",
    populate: {
      path: "friends friendRequests adminGroups",
      select: "name _id icon requests",
    },
  });

  if (user && (await bcrypt.compare(password, user.password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      boards: user.boards,
      token: generateToken(user._id),
    });
  } else {
    res.status(400).json("Invalid credentials");
  }
});

//@desc Get user data
//@route GET api/users/:id
//@access Private
const getUser = async (req, res) => {
  const id = req.params.id;
  const user = await User.findById(id).populate({
    path: "boards",
    select: "_id name icon groups groupInvites",
    populate: {
      path: "friends friendRequests adminGroups",
      select: "name _id icon requests",
    },
  });

  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      boards: user.boards,
      token: generateToken(user._id),
    });
  }
};

const getAllUsers = async (req, res) => {
  const users = await User.find({})
    .sort({ name: 1 })
    .populate("boards", "icon");

  res.status(200).json(users);
};

//search users
const searchUsers = async (req, res) => {
  const { search } = req.params;
  const users = await User.find({ name: new RegExp("^" + search, "i") });

  res.status(200).json(users);
};

// Update user data
const updateUser = async (req, res) => {
  const id = req.params.id;
  const board = req.body.board;
  const update = await User.findOneAndUpdate(
    { _id: id },
    {
      $push: { boards: board },
    }
  );
  if (!update) {
    return res.status(404).json({ error: "User doesn't exist" });
  }

  res.status(200).json(update);
};

// Delete a user
const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    const boards = user.boards;
    if (user) {
      Promise.all(boards.map((board) => Board.findByIdAndDelete(board)));
      res.status(200).json(user);
    }
  } catch (error) {
    throw new Error(error.message);
  }
};

//Update Account info
const updateAccount = async (req, res) => {
  const id = req.params.id;
  const { name, email, password, password2 } = req.body;

  if (password) {
    if (password !== password2) {
      res.status(400);
      throw new Error("Passwords do not match");
    } else {
      //Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const update = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: { password: hashedPassword },
        }
      );
      if (!update) {
        return res.status(404).json({ error: "User doesn't exist" });
      }
    }
  }

  //Check if email exists
  if (email) {
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("This email is taken");
    } else {
      const update = await User.findOneAndUpdate(
        { _id: id },
        {
          $set: { email: email },
        }
      );
      if (!update) {
        return res.status(404).json({ error: "User doesn't exist" });
      }
    }
  }

  if (name) {
    console.log("Email");
    const update = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: { name: name },
      }
    );
    if (!update) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
  }

  const user = await User.findById(id).populate({
    path: "boards",
    select: "_id name icon groups groupInvites",
    populate: {
      path: "friends friendRequests adminGroups",
      select: "name _id icon requests",
    },
  });
  console.log(user);
  if (user) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      boards: user.boards,
      token: generateToken(user._id),
    });
  }
};

//Reset password
const resetPassword = async (req, res) => {
  console.log(req.user);
  try {
    // get password
    const { password } = req.body;
    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const update = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: { password: hashedPassword },
      }
    );
    if (!update) {
      return res.status(404).json({ error: "User doesn't exist" });
    }
    res.status(200).json(update);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: error.message });
  }
};

const sendMail = async (req, res) => {
  const { email } = req.body;

  //Check if user exists
  const user = await User.findOne({ email });
  const ac_token = generateToken(user._id, "15m");
  const url = `https://reccenter.herokuapp.com/reset-password/${ac_token}`;
  const name = user.name;
  if (!user) {
    return res.status(400).json("User does not exist");
  }
  const mailOptions = {
    from: "reccenter.pinboard@gmail.com",
    to: email,
    subject: "Rec Center Password Reset",
    html: forgotPasswordHtml(name, url),
  };

  transporter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.status(200).json("Email sent!");
    }
  });
};

// Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});

transporter.verify((err, success) => {
  err
    ? console.log(err)
    : console.log(`=== Server is ready to take messages: ${success} ===`);
});

// Generate JWT
const generateToken = (id, exp) => {
  const period = exp ? exp : "30d";
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: period,
  });
};

module.exports = {
  registerUser,
  loginUser,
  getUser,
  searchUsers,
  updateUser,
  updateAccount,
  sendMail,
  resetPassword,
  deleteUser,
  getAllUsers,
};
