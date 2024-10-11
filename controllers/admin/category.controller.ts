import { Request, Response } from "express";
import Category from "../../models/category.model";
import slugify from "slugify";
import { systemConfig } from "../../config/system";
import moment from "moment";
// [GET] /admin/categories/
export const index = async (req: Request, res: Response) => {
  // SELECT * FROM categories WHERE deleted = false;
  const categories = await Category.findAll({
    where: {
      deleted: false,
    },
    raw: true
  });
  res.render("admin/pages/categories/index", {
    pageTitle: "Danh mục tour",
    categories: categories
  });
};
//[GET]/admin/categories/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/categories/create", {
    pageTitle: "Thêm mới danh mục",
  });
}
//[POST]/admin/categories/create
export const createPost = async (req: Request, res: Response) => {
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
    description: req.body.description
  };
  await Category.create(dataCategory);
  req.flash("success", "Tạo mới danh mục thành công");
  res.redirect(`/${systemConfig.prefixAdmin}/categories`);
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