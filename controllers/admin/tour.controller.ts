import { Request, Response } from "express";
import Tour from "../../models/tour.model";
import Category from "../../models/category.model";
import slugify from "slugify";
import { generateTourCode } from "../../helpers/generate.helper";
import { systemConfig } from "../../config/system";
import TourCategory, { ITourCategory } from "../../models/tour-category.model";
import { formatDateTimeLocal } from "../../helpers/formatDateTimeLocal.hellper";
import moment from "moment";
//[GET]/admin/tours
export const index = async (req: Request, res: Response) => {
  //SELECT * FROM tours WHERE deleted = false;
  const tours = await Tour.findAll({
    where: {
      deleted: false,
    },
    raw: true
  });

  tours.forEach(item => {
    if (item["images"]) {
      const images = JSON.parse(item["images"]);
      item["image"] = images[0];
    }
    item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
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
  res.render("admin/pages/tours/index", {
    pageTitle: "Danh sách tour",
    tours: tours
  })
};
//[GET]/admin/tours/create
export const create = async (req: Request, res: Response) => {
  //SELECT * FROM categories WHERE deleted = false AND status = "active";
  const categories = await Category.findAll({
    where: {
      deleted: false,
      status: "active",
    },
    raw: true
  });
  res.render("admin/pages/tours/create", {
    pageTitle: "Thêm mới tour",
    categories: categories
  });
}
//[POST]/admin/tours/create
export const createPost = async (req: Request, res: Response) => {
  if (req.body.position) {
    req.body.position = parseInt(req.body.position);
  } else {
    const countTour = await Tour.count();
    req.body.position = countTour + 1;
  }
  const slug = slugify(`${req.body.title}-${Date.now()}`, {
    lower: true
  });
  const dataTour = {
    title: req.body.title,
    code: "",
    price: parseInt(req.body.price),
    discount: parseInt(req.body.discount),
    stock: parseInt(req.body.stock),
    timeStart: req.body.timeStart,
    position: req.body.position,
    status: req.body.status,
    slug: slug,
    images: JSON.stringify(req.body.images),
    information: req.body.information,
    schedule: req.body.schedule
  };
  const tour = await Tour.create(dataTour);
  const tourId = tour.dataValues.id;
  const code = generateTourCode(tourId);
  await Tour.update({
    code: code
  }, {
    where: {
      id: tourId
    }
  });
  const dataTourCategory = {
    tour_id: tourId,
    category_id: parseInt(req.body.category_id)
  }
  await TourCategory.create(dataTourCategory);
  res.redirect(`/${systemConfig.prefixAdmin}/tours`);
}
// [GET] /admin/tours/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  const tour = await Tour.findOne({
    where: {
      id: id,
      deleted: false,
    },
    raw: true
  });
  tour["timeStart"] = formatDateTimeLocal(tour["timeStart"]);
  tour["images"] = JSON.parse(tour["images"]);
  const categories = await Category.findAll({
    where: {
      deleted: false,
      status: "active",
    },
    attributes: ['title', 'id'], // Chỉ lấy trường 'title' và 'id'
    raw: true
  });

  //Lấy danh mục  của tour từ bảng TourCategory
  const tourCategories: ITourCategory[] = await TourCategory.findAll({
    where: {
      tour_id: id,
    },
    raw: true,
  });
  // Chuyển đổi tourCategories thành mảng category_id  
  const categoryIds = tourCategories.map((item) => item.category_id);
  res.render("admin/pages/tours/edit", {
    pageTitle: "Chỉnh sửa tour",
    categories: categories,
    categoryIds: categoryIds,
    tour: tour
  })
}
// [POST] /admin/tours/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const dataTour = {
      title: req.body.title,
      price: parseInt(req.body.price),
      discount: parseInt(req.body.discount),
      stock: parseInt(req.body.stock),
      timeStart: req.body.timeStart,
      position: req.body.position,
      status: req.body.status,
      images: JSON.stringify(req.body.images),
      information: req.body.information,
      schedule: req.body.schedule
    };
    await Tour.update(dataTour, {
      where: {
        id: id
      }
    });
    const categoryIds = req.body.category_id.map((item) => parseInt(item, 10));
    await TourCategory.destroy({
      where: {
        tour_id: id, // Sử dụng tour_id  
      }
    });
    const idtour = parseInt(id, 10);

    // Thêm các bản ghi mới cho categoryIds  
    const tourCategoryPromises = categoryIds.map(category_id => {
      return TourCategory.create({ tour_id: idtour, category_id });
    });

    await Promise.all(tourCategoryPromises); // Chờ tất cả các promise hoàn thành
    req.flash('success', 'Cập nhật tour thành công!');
    res.redirect(`back`);
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
  }
}
// [GET] /admin/tours/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const tour = await Tour.findOne({
      where: {
        id: id,
        deleted: false,
      },
      raw: true
    });
    if (tour["images"]) {
      tour["images"] = JSON.parse(tour["images"]);
    }
    tour["timeStart"] = formatDateTimeLocal(tour["timeStart"]);
    tour["price_special"] = (tour["price"] * (1 - tour["discount"] / 100));
    //Lấy danh mục  của tour từ bảng TourCategory
    const tourCategories: ITourCategory[] = await TourCategory.findAll({
      where: {
        tour_id: id,
      },
      raw: true,
    });
    //Lấy ra danh mục của tour
    const categoryIds = tourCategories.map(category => category.category_id);
    const categories = await Category.findAll({
      where: {
        id: categoryIds,
        deleted: false,
        status: "active",
      },
      attributes: ['title'], // Chỉ lấy trường 'title' và 'id'
      raw: true
    });
    res.render("admin/pages/tours/detail", {
      pageTitle: "Chi tiết tour",
      categories: categories,
      tour: tour
    });
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/tours`);
  }
}
//[PATCH]/admin/tours/delete/:id
export const deleteTour = async (req: Request, res: Response) => {
  // if (res.locals.role.permissions.includes("songs_delete")) {
  try {
    const id = req.params.id;
    await TourCategory.destroy({
      where: {
        tour_id: id
      }
    });
    await Tour.destroy({
      where: {
        id: id,
      }
    });
    req.flash('success', 'Đã xóa!');
    res.json({
      code: 200
    })
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
  }
  // } else {
  //   res.send(`403`);
  // }
}
// [PATCH] /admin/songs/change-status/:statusChange/:id
export const changeStatus = async (req: Request, res: Response) => {
  // if (res.locals.role.permissions.includes("songs_edit")) {
  try {
    const {
      id,
      statusChange
    } = req.params;
    await Tour.update({
      status: statusChange
    }, {
      where: {
        id: id
      }
    });
    req.flash('success', 'Cập nhật trạng thái thành công!');

    res.json({
      code: 200
    });
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/tours`);
  }
}
// else {
//   res.send(`403`);
// }
// }