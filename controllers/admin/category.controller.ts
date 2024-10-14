import { Request, Response } from "express";
import Category from "../../models/category.model";
import slugify from "slugify";
import { systemConfig } from "../../config/system";
import moment from "moment";
import { Op } from "sequelize";
import { paginationCategories } from "../../helpers/pagination.helper";
// [GET] /admin/categories/
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = {
      deleted: false,
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.keyword && { title: { [Op.like]: `%${req.query.keyword}%` } })
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
    const pagination = await paginationCategories(req, find);
    //Hết  Phân trang
    // SELECT * FROM categories WHERE deleted = false;
    const categories = await Category.findAll({
      where: find,
      limit: pagination.limitItems, // số lượng tối thiểu   
      offset: pagination["skip"], // bỏ qua  
      order: [[sortKey, sortValue]],
      raw: true // cho phép bạn xác định thứ tự sắp xếp của kết quả truy vấn.
    });
    categories.forEach(item => {
      if (item["createdAt"]) {
        const formattedDate = moment(item["createdAt"]).format("DD/MM/YY HH:mm:ss");
        // Bạn có thể tạo một thuộc tính mới để lưu trữ ngày đã được định dạng  
        item["formattedCreatedAt"] = formattedDate; // Lưu ngày đã định dạng vào một thuộc tính mới  
      }
      if (item["updatedAt"]) {
        const formattedDate = moment(item["updatedAt"]).format("DD/MM/YY HH:mm:ss");
        // Bạn có thể tạo một thuộc tính mới để lưu trữ ngày đã được định dạng  
        item["formattedUpdatedAt"] = formattedDate; // Lưu ngày đã định dạng vào một thuộc tính mới  
      }
    });
    res.render("admin/pages/categories/index", {
      pageTitle: "Danh mục tour",
      categories: categories,
      keyword: req.query.keyword || "",
      filterStatus: filterStatus,
      pagination: pagination
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  }
};
//[GET]/admin/categories/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/categories/create", {
    pageTitle: "Thêm mới danh mục",
  });
}
//[POST]/admin/categories/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("s_create")) {
    if (req.body.position) {
      req.body.position = parseInt(req.body.position);
    } else {
      const countTour = await Category.count();
      req.body.position = countTour + 1;
    }
    const slug = slugify(`${req.body.title}-${Date.now()}`, {
      lower: true
    });
    const dataCategory = {
      title: req.body.title,
      position: req.body.position,
      status: req.body.status,
      slug: slug,
      image: req.body.image,
      description: req.body.description,
      createdBy: res.locals.account.id
    };
    await Category.create(dataCategory);
    req.flash("success", "Tạo mới danh mục thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/categories`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/categories/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const category = await Category.findOne({
    where: {
      id: id,
      deleted: false,
    },
    raw: true
  });
  res.render("admin/pages/categories/edit", {
    pageTitle: "Chỉnh sửa tour",
    category: category
  })
}