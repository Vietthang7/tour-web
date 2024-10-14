import Role from "../../models/role.model";
import { systemConfig } from "../../config/system";
import Account from "../../models/account.model";
import RoleAccount from "../../models/account-role.model";
import { NextFunction } from "express";
import { Response, Request } from "express";
export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.cookies.token) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const account = await Account.findOne({
    where: {
      token: req.cookies.token,
      deleted: false
    },
    attributes: ['fullName', 'email', 'phone', 'avatar', 'id'],
    raw: true
  });
  if (!account) {
    res.redirect(`/${systemConfig.prefixAdmin}/auth/login`);
    return;
  }
  const role_account = await RoleAccount.findOne({
    where: {
      account_id: account["id"]
    },
    raw: true
  })
  const role = await Role.findOne({
    where: {
      id: role_account["role_id"]
    },
    attributes: ['title', 'permissions'],
    raw: true
  });
  res.locals.account = account;
  res.locals.role = role;
  next();
}