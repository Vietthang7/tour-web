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
  const find = {
    deleted: false,
    ...(req.query.status && { status: req.query.status }),
    ...(req.query.keyword && { fullName: { [Op.iLike]: `%${req.query.keyword}%` } })
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
  // // Tìm kiếm 
  // let keyword = "";
  // if (req.query.keyword) {
  //   const regex = new RegExp(`${req.query.keyword}`, "i");
  //   find["fullName"] = regex;
  //   keyword = req.query.keyword.toString();
  // }
  // // Hết tìm kiếm

  //Sắp xếp
  // const sort = {};
  // const sortKey = `${req.query.sortKey}`;
  // if (sortKey && req.query.sortValue) {
  //   sort[sortKey] = req.query.sortValue;
  // } else {
  //   sort["createdAt"] = "desc";
  // }
  const sortKey: string = req.query.sortKey as string || 'createdAt';
  const sortValue: string = req.query.sortValue as string || 'desc';
  // Hết sắp xếp
  //Phân trang
  const pagination = await paginationAccounts(req, find);
  //Hết  Phân trang

  const records = await Account
    .findAll({
      where: find,
      limit: pagination.limitItems, // số lượng tối thiểu   
      offset: pagination["skip"], // bỏ qua  
      // order: [[sortKey || 'createdAt', sort[sortKey]]]
      order: [[sortKey, sortValue]]
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
    const role = await Role.findOne({
      where: {
        id: record["role_id"],
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
  // if (res.locals.role.permissions.includes("accounts_create")) {
    

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
  // req.body.createdBy = res.locals.account.id;
  const account =  await Account.create(req.body);
  const accountId = account.dataValues.id;
  const dataRoleAccounts = {
    account_id: accountId,
    role_id: parseInt(req.body.role_id)
  }
  await RoleAccount.create(dataRoleAccounts);
  res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  // } else {
  //   res.send("403");
  // }
}