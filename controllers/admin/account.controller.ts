import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import Account from "../../models/account.model";
import RoleAccount from "../../models/account-role.model";
import Role from "../../models/role.model";
import md5 from "md5";
import { paginationAccounts } from "../../helpers/pagination.helper";
import { Op } from "sequelize";
import moment from "moment"; // Đảm bảo bạn đã import moment  
import { generateRandomString } from "../../helpers/generateRandom.helper";

// [GET] /admin/accounts  
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = {
      deleted: false,
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.keyword && { fullName: { [Op.like]: `%${req.query.keyword}%` } })
    }
    const filterStatus = [{
      label: "Tất cả",
      value: ""
    },
    {
      label: "Đang hoạt động",
      value: "active"
    },
    {
      label: "Dừng hoạt động",
      value: "inactive"
    },
    ];
    const sortKey: string = req.query.sortKey as string || 'createdAt';
    const sortValue: string = req.query.sortValue as string || 'asc';
    // Hết sắp xếp
    //Phân trang
    const pagination = await paginationAccounts(req, find);
    //Hết  Phân trang

    const records = await Account
      .findAll({
        where: find,
        limit: pagination.limitItems, // số lượng tối thiểu   
        offset: pagination["skip"], // bỏ qua  
        order: [[sortKey, sortValue]] // cho phép bạn xác định thứ tự sắp xếp của kết quả truy vấn.
      });
    for (const item of records) {
      if (item["createdBy"]) {
        const accountCreated = await Account.findOne({
          where: {
            id: item["createdBy"]
          }
        });
        item["createdByFullName"] = accountCreated["fullName"];
      } else {
        item["createdAtFormat"] = "";
      }
      item["createdAtFormat"] = moment(item["createdAt"]).format("DD/MM/YY HH:mm:ss");
      if (item["updatedBy"]) {
        const accountUpdated = await Account.findOne({
          where: {
            id: item["updatedBy"]
          }
        });
        item["updatedByFullName"] = accountUpdated["fullName"];
      } else {
        item["updatedByFullName"] = "";
      }

      item["updatedAtFormat"] = moment(item["updatedAt"]).format("DD/MM/YY HH:mm:ss");
    } for (const record of records) {
      const role_account = await RoleAccount.findOne({
        where: {
          account_id: record["id"]
        }
      })
      const role = await Role.findOne({
        where: {
          id: role_account["role_id"],
          deleted: false
        }
      });
      record["roleTitle"] = role["title"];
    }
    res.render("admin/pages/accounts/index", {
      pageTitle: "Tài khoản admin",
      records: records,
      keyword: req.query.keyword || "",
      filterStatus: filterStatus,
      pagination: pagination
    }
    );
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }

}
// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  const roles = await Role.findAll({
    where: {
      deleted: false
    }
  })
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tài khoản admin",
    roles: roles
  }
  );
}
// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_create")) {


    const existAccountTrash = await Account.findOne({
      where: {
        email: req.body.email,
        deleted: true
      }
    })
    if (existAccountTrash) {
      req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
      res.redirect("back");
      return;
    }
    const existAccount = await Account.findOne({
      where: {
        email: req.body.email,
        deleted: false
      }
    })
    if (existAccount) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
    req.body.password = md5(req.body.password);
    req.body.token = generateRandomString(30);
    req.body.createdBy = res.locals.account.id;
    const account = await Account.create(req.body);
    const accountId = account.dataValues.id;
    const dataRoleAccounts = {
      account_id: accountId,
      role_id: parseInt(req.body.role_id)
    }
    await RoleAccount.create(dataRoleAccounts);
    req.flash("success", "Tạo mới tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      where: {
        id: id,
        deleted: false
      },
      raw: true
    });
    if (account) {
      const role_account = await RoleAccount.findOne({
        where: {
          account_id: account["id"]
        },
        raw: true
      })
      const roles = await Role.findAll({
        where: {
          deleted: false
        },
        raw: true
      })
      res.render("admin/pages/accounts/edit", {
        pageTitle: "Tài khoản admin",
        roles: roles,
        account: account,
        role_account: role_account
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}
// [POST] /admin/tours/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {

    try {
      const role_id = req.body.role_id;
      delete req.body.role_id;
      const id: string = req.params.id;
      if (req.body.password == "") {
        delete req.body.password;
      } else {
        req.body.password = md5(req.body.password);
      }
      req.body.updatedBy = res.locals.account.id;
      await Account.update(req.body, {
        where: {
          id: id
        }
      });
      await RoleAccount.destroy({
        where: {
          account_id: id, // Sử dụng account_id  
        }
      });
      await RoleAccount.create({ account_id: id, role_id: role_id });
      req.flash('success', 'Cập nhật tài khoản thành công!');
    } catch (error) {
      req.flash("error", "Id tài khoản không hợp lệ!");
    }
    res.redirect(`back`);
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      where: {
        id: id,
        deleted: false,
      },
      raw: true
    });
    const role_account = await RoleAccount.findOne({
      where: {
        account_id: id,
      },
      raw: true,
    });


    const role = await Role.findOne({
      where: {
        id: role_account["role_id"],
        deleted: false,
      },
      attributes: ['title', 'information'], // Chỉ lấy trường 'title' và 'id'
      raw: true
    });
    res.render("admin/pages/accounts/detail", {
      pageTitle: "Chi tiết tài khoản",
      role: role,
      account: account
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}
//[PATCH]/admin/tours/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_delete")) {
    try {
      const id = req.params.id;
      await RoleAccount.destroy({
        where: {
          account_id: id
        }
      });
      await Account.destroy({
        where: {
          id: id,
        }
      });
      req.flash('success', 'Đã xóa!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/change-status/:statusChange/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      const data = {
        status: statusChange
      }
      await Account.update(data, {
        where: {
          id: id
        }
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "active":
        case "inactive":
          await Account.update({ status: status }, {
            where: {
              id: {
                [Op.in]: ids
              }
            }
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await Account.update({ deleted: true }, {
            where: {
              id: {
                [Op.in]: ids
              }
            }
          });
          req.flash('success', 'Đã chuyển vào thùng rác!');
          break;
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } else {
    res.send(`403`);
  }
}