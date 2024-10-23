const Model = require("../models/user.model.js");
const randomstring = require("randomstring");
const logger = require("../helper/logger.js");
const {
    
  generateJwtAccessToken,
  checkPassword,
  createHashPassword,
  generateOTP,
  dateDiffInMinutes,
  PASSWORD_REGEX,
} = require("../helper/index.js");
const errorHandler = require("../helper/errorHandler.js");
const { SendOtpMail } = require("../mails/sendEmail.js");
const { Status, UserRole } = require("../helper/typeConfig.js");

exports.login = async (params) => {
  try {
    let userDetails = await Model.findOne({
      email: params.email,
      deletedAt: null,
    })
      .select(
        "_id fullname email password roleId emailVerified status deletedAt"
      )
      .lean();
    if (!userDetails)
      return {
        status: 400,
        message: "Login details is incorrect, please try again.",
      };

    if (!checkPassword(params.password, userDetails.password)) {
      return {
        status: 400,
        message: `Hey ${userDetails?.fullname.firstName}, you have entered an incorrect password, please try again.`,
      };
    }
    if (userDetails.status != Status.ACTIVE)
      return { status: 400, message: "Your Account is Deactivated" };

    if (userDetails.emailVerified == 2)
      return { status: 400, message: "Account is not verified." };

    let role = await Model.populate(userDetails, { path: "roleId" });

    if (role.roleId.name != UserRole.ADMIN)
      return { status: 400, message: "Access Denied" };
    // if (userDetails.roleId != UserRole.ADMIN)
    //   return { status: 400, message: "Access Denied" };

    const refreshtoken = randomstring.generate(256);
    await Model.updateOne(
      { _id: userDetails._id },
      { $push: { refreshTokens: refreshtoken }, last_login: new Date() }
    );

    const accessToken = await generateJwtAccessToken({
      email: userDetails.email,
      fullname: userDetails?.fullname,
      firstName: userDetails?.fullname.firstName,
      lastName: userDetails?.fullname.lastName,
      role: userDetails.role ? userDetails.role : "",
      deletedAt: userDetails.deletedAt ? userDetails.deletedAt : "",
    });

    return {
      status: 200,
      message: `Hi ${userDetails?.fullname.firstName}, you have successfully logged in.`,
      accessToken: accessToken,
      refreshToken: refreshtoken,
      expiresIn: process.env.JWT_EXPIRE_TIME,
    };
  } catch (err) {
    logger.error({ params, err });
    return { status: 400, message: err.message };
  }
};

exports.signup = async (params) => {
  try {
    const checkEmail = await Model.findOne({
      email: params.email.toLowerCase(),
      deletedAt: null,
    });
    if (checkEmail) return { status: 400, message: "Email already exists" };


    
    const newUser = await new Model({
      ...params,
      name: params.email.split("@")[0],
      email: params.email,
      password: createHashPassword(params.password),
    }).save();

    const refreshToken = randomstring.generate(256);
    await Model.updateOne(
      { _id: newUser._id },
      { $push: { refreshTokens: refreshToken }, last_login: new Date() }
    );

    const otpRes = await this.sendOtp({ email: params.email });
    return otpRes;
  } catch (error) {
    return errorHandler(error, params);
  }
};


exports.userLogin = async (params) => {
  try {
    let userDetails = await Model.findOne({
      email: params.email,
      deletedAt: null,
    })
      .select(
        "_id fullname email password roleId emailVerified status deletedAt"
      )
      .lean();
    if (!userDetails)
      return {
        status: 400,
        message: "Login details is incorrect, please try again.",
      };

    if (!checkPassword(params.password, userDetails.password)) {
      return {
        status: 400,
        message: `Hey ${userDetails?.fullname.firstName}, you have entered an incorrect password, please try again.`,
      };
    }
    if (userDetails.status != Status.ACTIVE)
      return { status: 400, message: "Your Account is Deactivated" };

    if (userDetails.emailVerified == 2)
      return { status: 400, message: "Account is not verified." };

    // if (userDetails.role == UserRole.ADMIN)
    //   return { status: 400, message: "Login using admin" };
    let role = await Model.populate(userDetails, { path: "roleId" });

    if (role.roleId.name == UserRole.ADMIN)
      return { status: 400, message: "Login using admin" };

    const refreshtoken = randomstring.generate(256);
    await Model.updateOne(
      { _id: userDetails._id },
      { $push: { refreshTokens: refreshtoken }, last_login: new Date() }
    );

    const accessToken = await generateJwtAccessToken({
      email: userDetails.email,
      fullname: userDetails?.fullname,
      firstName: userDetails?.fullname.firstName,
      lastName: userDetails?.fullname.lastName,
      role: userDetails.role ? userDetails.role : "",
      deletedAt: userDetails.deletedAt ? userDetails.deletedAt : "",
    });

    return {
      status: 200,
      message: `Hi ${userDetails?.fullname.firstName}, you have successfully logged in.`,
      accessToken: accessToken,
      refreshToken: refreshtoken,
      expiresIn: process.env.JWT_EXPIRE_TIME,
      userId: userDetails._id,
    };
  } catch (err) {
    logger.error({ params, err });
    return { status: 400, message: err.message };
  }
};

exports.refresh = async (params) => {
  try {
    const userDetails = await Model.findOne({
      refreshTokens: params.refreshToken,
      deleted_at: null,
    });

    if (!userDetails) {
      return {
        status: 400,
        message: "Invalid token, please try again.",
      };
    }

    await Model.updateOne(
      { _id: userDetails._id },
      {
        $pull: { refreshTokens: params.refreshToken },
      }
    );

    const refreshToken = randomstring.generate(256);
    await Model.updateOne(
      { _id: userDetails._id },
      {
        $push: { refreshTokens: refreshToken },
        last_login: new Date(),
      }
    );

    const accessToken = jwt.sign(
      {
        email: userDetails.email,
        firstName: userDetails?.firstName,
        lastName: userDetails?.lastName,
        roles: userDetails.roles ? userDetails.roles : "",
        currentDay: userDetails.currentDay ? userDetails.currentDay : "",
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: process.env.JWT_EXPIRE_TIME }
    );

    return {
      status: 200,
      message: "New token successfully egenrated.",
      accessToken,
      refreshToken,
    };
  } catch (err) {
    console.log("err", err);
    return { status: 400, message: err.message };
  }
};


exports.sendOtp = async (params) => {
  try {
    const checkData = await Model.findOne({
      email: params.email.toLowerCase(),
      deletedAt: null,
    }).lean();
    if (!checkData) return { status: 404, message: "Invalid Email." };

    const otp = generateOTP();

    await Model.findByIdAndUpdate(checkData._id, {
      emailOtp: otp,
      emailOtpTime: new Date(),
    });
    // await SendOtpMail({
    //   email: checkData.email,
    //   otp: otp,
    // });
    return {
      status: 200,
      message: "An otp has been send to your email",
    };
  } catch (error) {
    return errorHandler(error, params);
  }
};

exports.verifyOtp = async (params) => {
  try {
    const findUser = await Model.findOne({
      email: params.email.toLowerCase(),
      deletedAt: null,
    });
    if (!findUser) return { status: 404, message: "Invalid Email." };

    if (findUser.emailOtp != params.otp)
      return { status: 400, message: "Invalid OTP." };

    if (dateDiffInMinutes(new Date(), new Date(findUser.emailOtpTime)) > 30)
      return { status: 400, message: "The OTP has been expired." };

    if (params.requestType == "singup") {
      if (findUser.emailVerified == 1)
        return { status: 400, message: "Your email already verified" };

      await Model.findByIdAndUpdate(findUser._id, {
        emailOtp: null,
        emailOtpTime: null,
        emailVerified: 1,
        emailVerifiedAt: new Date(),
      });
    }

    return { status: 200, message: "Your OTP has been verified" };
  } catch (error) {
    return errorHandler(error, params);
  }
};

exports.resetPassword = async (params) => {
  try {
    const checkOtp = await this.verifyOtp(params);
    if (checkOtp.status != 200) return checkOtp;

    if (!params.newPassword)
      return { status: 400, message: "New Password is required" };

    if (!PASSWORD_REGEX.test(params.newPassword)) {
      return {
        status: 400,
        message: "Minimum eight characters, at least one letter, one number",
      };
    }

    if (params.email !== "undefined") {
      delete params.email;
    }

    const new_password = createHashPassword(params.newPassword);
    const updateUser = await Model.findOneAndUpdate(
      { email: params.email?.toLowerCase() },
      { password: new_password },
      { new: true }
    )
      .select({
        deletedAt: 0,
        deletedBy: 0,
        password: 0,
        refreshToken: 0,
        refreshTokens: 0,
      })
      .lean();

    const accessToken = await generateJwtAccessToken(updateUser);

    return {
      status: 200,
      message: "Password change successfully.",
      access_token: accessToken,
      //updateUser
    };
  } catch (err) {
    return errorHandler(err, params);
  }
};
