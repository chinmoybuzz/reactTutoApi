const authRepo = require("../repository/auth.repository");
// const { verifyJwtToken } = require("../helper");

const login = async (req, res) => {
  const data = await authRepo.login(req.body);
  return res.status(data.status).send(data);
};
const signup = async (req, res) => {
  const data = await authRepo.signup(req.body);
  return res.status(data.status).send(data);
};

const userLogin = async (req, res) => {
  const data = await authRepo.userLogin(req.body);
  return res.status(data.status).send(data);
};



const sendOtp = async (req, res) => {
  const data = await authRepo.sendOtp(req.body);
  return res.status(data.status).send(data);
};
const verifyOtp = async (req, res) => {
  const data = await authRepo.verifyOtp(req.body);
  return res.status(data.status).send(data);
};
const resetPassword = async (req, res) => {
  const data = await authRepo.resetPassword(req.body);
  return res.status(data.status).send(data);
};

const verifyToken = async (req, res) => {
  try {
    const user = res.locals.authenticatedUser;
    return res.status(200).send({ message: "Token Verified", data: user });
  } catch (err) {
    return res.status(400).send({ message: "Invalid Token" });
  }
};

const refreshToken = async (req, res) => {
  try {
    const data = await authRepo.refresh(req.body);
    return res.status(data.status).send(data);
  } catch (err) {
    return res.status(400).send(err.message);
  }
};

module.exports = {
  login,
  verifyToken,
  refreshToken,
  signup,
  verifyOtp,
  resetPassword,
  sendOtp,
  userLogin,
};
