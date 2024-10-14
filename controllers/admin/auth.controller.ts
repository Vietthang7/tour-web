import { Request, Response } from "express";
import Account from "../../models/account.model";
import md5 from "md5";
import { systemConfig } from "../../config/system";
import { generateRandomNumber } from "../../helpers/generateRandom.helper";
import { sendMail } from "../../helpers/sendEmail.helper";
import ForgotPassword from "../../models/forgot-password.model";
// [GET] /admin/auth/login
export const login = async (req: Request, res: Response) => {
  res.render("admin/pages/auth/login", {
    pageTitle: "Đăng nhập"
  });
}
// [POST] /admin/auth/login
export const loginPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const existAccount = await Account.findOne({
    where: {
      email: email,
      deleted: true
    },
    raw: true
  });
  if (existAccount) {
    req.flash("error", "Tài khoản đã bị khóa!");
    res.redirect("back");
    return;
  }
  const account = await Account.findOne({
    where: {
      email: email,
      deleted: false
    },
    raw: true
  });

  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (md5(password) != account["password"]) {
    req.flash("error", "Sai mật khẩu!");
    res.redirect("back");
    return;
  }
  if (account["status"] != "active") {
    req.flash("error", "Tài khoản đang bị khóa!");
    res.redirect("back");
    return;
  }
  res.cookie("token", account["token"]);
  res.redirect(`/${systemConfig.prefixAdmin}/categories`);
}
// [GET] /admin/auth/logout
export const logOut = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
}
// [GET] /admin/auth/password/forgot
export const forgotPassword = async (req: Request, res: Response) => {
  res.render("admin/pages/auth/forgot-password", {
    pageTitle: "Lấy lại mật khẩu",
  });
};
//[POST] /auth/password/forgot
export const forgotPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const account = await Account.findOne({
    where: {
      email: email,
      deleted: false
    }
  });
  if (!account) {
    req.flash("error", "Email không tồn tại trong hệ thống!");
    res.redirect("back");
    return;
  }
  if (account["status"] != "active") {
    req.flash("error", "Tài khoản đã dừng hoạt động!");
    res.redirect("back");
    return;
  }
  const otp = generateRandomNumber(6);

  // Việc 1: Lưu email, OTP vào database
  const forgotPasswordData = {
    email: email,
    otp: otp,
    expireAt: Date.now() + 3 * 60 * 1000
  };
  await ForgotPassword.create(forgotPasswordData);

  // Việc 2: Gửi mã OTP qua email của account
  const subject = "Mã OTP lấy lại mật khẩu."
  const htmlSendMail = `Mã OTP xác thực của bạn là <b style = "color:green;"> ${otp} </b>.Mã OTP có hiệu lực trong 3 phút .Vui lòng không cung cấp mã OTP cho người khác`;
  sendMail(email, subject, htmlSendMail);
  res.redirect(`/${systemConfig.prefixAdmin}/auth/password/otp?email=${email}`);
};
//[GET]/auth/password/otp
export const otpPassword = async (req: Request, res: Response) => {
  const email = req.query.email;
  res.render("admin/pages/auth/otp-password", {
    pageTitle: "Xác thực OTP",
    email: email
  });
};
//[POST]/auth/password/otp
export const otpPasswordPost = async (req: Request, res: Response) => {
  const email = req.body.email;
  const otp = req.body.otp;
  const result = await ForgotPassword.findOne({
    where: {
      email: email,
      otp: otp
    },
    raw: true
  });

  if (!result) {
    req.flash("error", "OTP không hợp lệ");
    res.redirect("back");
    return;
  }
  const account = await Account.findOne({
    where: {
      email: email
    },
    raw: true
  });
  res.cookie("token", account["token"]);
  res.redirect(`/${systemConfig.prefixAdmin}/auth/password/reset`);
};
// [GET] /auth/password/reset
export const resetPassword = async (req: Request, res: Response) => {
  res.render("admin/pages/auth/reset-password", {
    pageTitle: "Đổi lại mật khẩu mới",
  });
};
// [PATCH] /auth/password/reset
export const resetPasswordPatch = async (req: Request, res: Response) => {
  if (req.body.password != req.body.confirmpassword) {
    req.flash("error", "Mật khẩu không khớp");
    res.redirect("back");
    return;
  }
  const password = req.body.password;
  const token = req.cookies.token;
  await Account.update(password, {
    where: {
      token: token,
      deleted: false
    }
  });
  res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
};