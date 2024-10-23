// const Model = require("../models/emailTemplate.model");
// const SiteSettingModel = require("../models/siteSetting.model");
const {
  EmailTemplatesCode,
  JobApplicationStatus,
} = require("../helper/typeConfig");
const { MailSender } = require("../config/mailer");

let SiteSetting = null;

const NotifyAdminJobApplicationSubmitedMail = async (params) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplatesCode.JOB_APPLICATION_SUBMITED_FOR_ADMIN,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplatesCode.JOB_APPLICATION_SUBMITED_FOR_ADMIN
    );
  if (!SiteSetting) SiteSetting = await SiteSettingModel.findOne().lean();

  const userName = `${params.user?.fullname?.firstName} ${params.user?.fullname?.lastName}`;
  let html = emailTemplate.content
    .replace("{%LOGO%}", process.env.BASE_URL + SiteSetting.logo)
    .replace("{%JOB_TITLE%}", params.job?.title)
    .replace("{%APP_NAME%}", SiteSetting.title)
    .replace("{%USER_EMAIL%}", params.user?.email)
    .replace("{%RESUME_URL%}", params.cvFile?.fileUrl)
    .replace("{%APPLICATION_DATE%}", params.applyDate)
    .replace("{%USER_NAME%}", userName)
    .replace("{%MESSAGE%}", params.message);

  const mailData = {
    from: { name: userName, address: emailTemplate.fromMail },
    html,
    to: params.company?.email,
    subject: `${params.job?.title} candidate - ${userName} Apply on ${emailTemplate.fromName}`,
  };
  await MailSender.send(mailData);
};

const NotifyUserJobApplicationSubmitedMail = async (params) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplatesCode.JOB_APPLICATION_SUBMITED_FOR_USER,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplatesCode.JOB_APPLICATION_SUBMITED_FOR_USER
    );
  if (!SiteSetting) SiteSetting = await SiteSettingModel.findOne().lean();

  let html = emailTemplate.content
    .replace("{%LOGO%}", process.env.BASE_URL + SiteSetting.logo)
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replace("{%YEAR%}", new Date().getFullYear())
    .replace("{%JOB_TITLE%}", params.job?.title)
    .replace("{%USER_EMAIL%}", params.user?.email)
    .replace(
      "{%USER_NAME%}",
      `${params.user?.fullname?.firstName} ${params.user?.fullname?.lastName}`
    )
    .replaceAll(
      "{%COMPANY_NAME%}",
      `${params.company?.fullname?.firstName} ${params.company?.fullname?.lastName}`
    );

  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: params.user?.email,
    subject: emailTemplate.subject,
  };
  MailSender.send(mailData);
};

const SendJobStatusChangeMail = async (params) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplatesCode.JOB_STATUS_CHANGE,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplatesCode.JOB_STATUS_CHANGE
    );
  if (!SiteSetting) SiteSetting = await SiteSettingModel.findOne().lean();

  let statusName = "";
  switch (params.status) {
    case JobApplicationStatus.ACCEPT:
      statusName = "Accepted";
      break;
    case JobApplicationStatus.PENDING:
      statusName = "Pending";
      break;
    case JobApplicationStatus.REJECT:
      statusName = "Rejected";
      break;
  }

  let html = emailTemplate.content
    .replace("{%LOGO%}", process.env.BASE_URL + SiteSetting.logo)
    .replace("{%JOB_TITLE%}", params.job?.title)
    .replace(
      "{%COMPANY_NAME%}",
      `${params.company?.fullname?.firstName} ${params.company?.fullname?.lastName}`
    )
    .replace("{%JOB_STATUS%}", statusName)
    .replace("{%APP_NAME%}", SiteSetting.title);

  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: params.user?.email,
    subject: emailTemplate.subject,
  };
  MailSender.send(mailData);
};

const SendOtpMail = async (params) => {
  const emailTemplate = await Model.findOne({
    code: EmailTemplatesCode.SEND_OTP,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " + EmailTemplatesCode.SEND_OTP
    );
  if (!SiteSetting) SiteSetting = await SiteSettingModel.findOne().lean();

  let html = emailTemplate.content
    .replace("{%LOGO%}", process.env.BASE_URL + SiteSetting.logo)
    .replace("{%LOGO_ALT_TEXT%}", SiteSetting.title + " Logo")
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replace("{%YEAR%}", new Date().getFullYear())
    .replace("{%OTP%}", params.otp);

  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: params.email,
    subject: params.subject ? params.subject : emailTemplate.subject,
  };
  MailSender.send(mailData);
};

const NotifyUserEventEnrollMail = async (params) => {
  //console.log("params", params);
  const emailTemplate = await Model.findOne({
    code: EmailTemplatesCode.EVENT_ENROLL_SUBMITED_FOR_ATTENDEES_USER,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplatesCode.EVENT_ENROLL_SUBMITED_FOR_ATTENDEES_USER
    );
  if (!SiteSetting) SiteSetting = await SiteSettingModel.findOne().lean();

  let html = emailTemplate.content
    .replace("{%LOGO%}", process.env.BASE_URL + SiteSetting.logo)
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replace("{%YEAR%}", new Date().getFullYear())
    .replace("{%JOB_TITLE%}", params.job?.title)
    .replace("{%USER_EMAIL%}", params.user?.email)
    .replace(
      "{%USER_NAME%}",
      `${params.user?.fullname?.firstName} ${params.user?.fullname?.lastName}`
    )
    .replaceAll(
      "{%COMPANY_NAME%}",
      `${params.company?.fullname?.firstName} ${params.company?.fullname?.lastName}`
    );
  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: params.user?.email,
    subject: emailTemplate.subject,
  };
  //console.log("mailData", mailData);
  MailSender.send(mailData);
};
const NotifyEnquiryMail = async (params) => {
  // console.log("params", params);
  const emailTemplate = await Model.findOne({
    code: EmailTemplatesCode.ENQUIRY_SUBMITED_FOR_USER,
    deletedAt: null,
  });
  if (!emailTemplate)
    throw new Error(
      "Email template not Found on this Code " +
        EmailTemplatesCode.ENQUIRY_SUBMITED_FOR_USER
    );
  if (!SiteSetting) SiteSetting = await SiteSettingModel.findOne().lean();

  let html = emailTemplate.content
    .replace("{%LOGO%}", process.env.BASE_URL + SiteSetting.logo)
    .replaceAll("{%APP_NAME%}", SiteSetting.title)
    .replace("{%YEAR%}", new Date().getFullYear())
    .replace("{%ENQUIRY_TITLE%}", params.subject)
    .replace("{%ENQUIRY_MESSAGE%}", params.message)
    .replace("{%USER_EMAIL%}", params.email)
    .replace("{%PHONE_NUMBER%}", params.phone)
    .replace("{%PHONE_CODE%}", params.phoneCode)
    .replace(
      "{%USER_NAME%}",
      `${params.user?.fullname?.firstName} ${params.user?.fullname?.lastName}`
    );
  const mailData = {
    from: { name: emailTemplate.fromName, address: emailTemplate.fromMail },
    html,
    to: params.email,
    subject: emailTemplate.subject,
    cc: emailTemplate.ccMail,
  };
  // console.log("mailData", mailData);
  MailSender.send(mailData);
};

module.exports = {
  SendJobStatusChangeMail,
  NotifyUserJobApplicationSubmitedMail,
  NotifyAdminJobApplicationSubmitedMail,
  SendOtpMail,
  NotifyUserEventEnrollMail,
  NotifyEnquiryMail,
};
