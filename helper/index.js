const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
// const activityLogModel = require("../models/activityLog.model");


const PASSWORD_REGEX = /^(?=.*[a-zA-Z])(?=.*\d).{8,}$/;
const DEFAULT_IMAGE = process.env.BASE_URL + "storage/no-data-found.jpg";
const DEFAULT_USER_IMAGE = process.env.BASE_URL + "storage/no-user-image.png";

const generateJwtAccessToken = async (params) => {
  return jwt.sign(
    {
      ...params,
    },
    process.env.JWT_SECRET_KEY,
    { expiresIn: process.env.JWT_EXPIRE_TIME }
  );
};
const verifyJwtToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET_KEY);
};
const checkPassword = (password, hashPassword) => {
  return bcrypt.compareSync(password, hashPassword);
};
const createHashPassword = (password) => {
  const salt = bcrypt.genSaltSync(12);
  return bcrypt.hashSync(password, salt);
};

const convertFieldsToAggregateObject = (fields, demilater = ",") => {
  if (!fields) return { deletedAt: 0, deletedBy: 0 };
  if (typeof fields == "string") {
    fields = fields.trim();
    fields = fields.split(demilater);
  }
  let obj = {};
  for (let el of fields) if (el) obj[el] = 1;

  return obj;
};

const fileConcat = (column) => {
  return {
    $cond: [column, { $concat: [process.env.BASE_URL, column] }, DEFAULT_IMAGE],
  };
};
const userFileConcat = (column) => {
  return {
    $cond: [column, { $concat: [process.env.BASE_URL, column] }, DEFAULT_USER_IMAGE],
  };
};

const generateOTP = () => Math.floor(Math.random() * 1000000);
const dateDiffInMinutes = (date1, date2) => {
  const total = date1.getTime() - date2.getTime();
  return Math.floor(total / 1000 / 60);
};

// const activityLogData = async ( action, authUser, typeId, type) => {
//   await activityLogModel.insertMany({
    
//     action: action,
//     userId: authUser,
//     // time: new Date(),
//     typeId: typeId,
//     type: type,
//   });
// };

const aggregateArrayFileConcat = (fields) => {
  return {
    $map: {
      input: fields,
      as: "image",
      in: {
        $concat: [process.env.BASE_URL, "$$image"],
      },
    },
  };
};
module.exports = {
  generateJwtAccessToken,
  PASSWORD_REGEX,
  checkPassword,
  createHashPassword,
  convertFieldsToAggregateObject,
  verifyJwtToken,
  fileConcat,
  generateOTP,
  dateDiffInMinutes,
  aggregateArrayFileConcat,
  userFileConcat
  // activityLogData
};
