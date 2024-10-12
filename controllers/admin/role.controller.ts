import Role from "../../models/role.model";
import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import Account from "../../models/account.model";
import moment from "moment";
import { where } from "sequelize";
//[GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  const records = await Role.findAll({
    where: {
      deleted: false
    },
    raw: true
  });
  for (const record of records) {
    // Người tạo
    if (record["createdBy"]) {
      const accountCreated = await Account.findOne({
        where: {
          _id: record["createdBy"]
        }
      });
      record["createdByFullName"] = accountCreated["fullName"];
    } else {
      record["createdByFullName"] = "";
    }
    record["createdAtFormat"] = moment(record["createdAt"]).format("DD/MM/YY HH:mm:ss");
    // Người cập nhật
    if (record["updatedBy"]) {
      const accountUpdated = await Account.findOne({
        where: {
          _id: record["updatedBy"]
        }
      });
      record["updatedByFullName"] = accountUpdated["fullName"];
    } else {
      record["updatedByFullName"] = "";
    }
    record["updatedAtFormat"] = moment(record["updatedAt"]).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records
  });
}
//[GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
  });
};
//[POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  // if (res.locals.role.permissions.includes("roles_create")) {
  //   req.body.createdBy = res.locals.account.id;
  await Role.create(req.body);
  req.flash("success", "Tạo mới nhóm quyền thành công");
  res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  // } else {
  //   res.send(`403`);
  // }
}
// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
  const records = await Role.findAll({
    where: {
      deleted: false
    },
    raw: true
  });
  records.forEach(item => {
    if (item["permissions"]) {
      item["permissions"] = JSON.parse(item["permissions"]);
    } else {
      item["permissions"] = [];
    }
  });
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records
  });
};
// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  // if (res.locals.role.permissions.includes("roles_permissions")) {
  const roles = req.body;
  for (const role of roles) {
    const data = {
      permissions: JSON.stringify(role.permissions)
    }
    await Role.update(data, {
      where: {
        id: role.id,
        deleted: false
      }
    });
  }

  res.json({
    code: 200,
    message: "Cập nhật thành công!"
  });
  // } else {
  //   res.send(`403`);
  // }
}