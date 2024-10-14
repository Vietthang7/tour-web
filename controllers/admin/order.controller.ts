import Order from "../../models/order.model";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";
import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import { paginationOrders } from "../../helpers/pagination.helper";
import { Op, or } from "sequelize";
import moment from "moment";
import { triggerAsyncId } from "async_hooks";
//[GET]/admin/tours
export const index = async (req: Request, res: Response) => {
  try {
    const find: any = {
      deleted: false,
      ...(req.query.status && { status: req.query.status }),
      ...(req.query.keyword && { code: { [Op.like]: `%${req.query.keyword}%` } })
    }
    const filterStatus = [{
      label: "Tất cả",
      value: ""
    },
    {
      label: "Đã xác nhận",
      value: "confirm"
    },
    {
      label: "Chưa xác nhận",
      value: "initial"
    },
    ];
    const sortKey: string = req.query.sortKey as string || 'createdAt';
    const sortValue: string = req.query.sortValue as string || 'asc';
    // Hết sắp xếp
    //Phân trang
    const pagination = await paginationOrders(req, find);
    const orders = await Order
      .findAll({
        where: find,
        limit: pagination.limitItems, // số lượng tối thiểu   
        offset: pagination["skip"], // bỏ qua  
        order: [[sortKey, sortValue]],
        raw: true // cho phép bạn xác định thứ tự sắp xếp của kết quả truy vấn.
      });

    for (const item of orders) {
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
      const item_oders = await OrderItem.findAll({
        where: {
          orderId: item["id"]
        },
        raw: true
      });
      item["totalPrice"] = 0;
      item["stock"] = 0;
      item["type"] = 0;
      for (const order of item_oders) {
        item["type"] += 1;
        item["totalPrice"] += order["price"] * (1 - order["discount"] / 100) * order["quantity"];
        item["stock"] += order["quantity"];
      }
    }
    res.render("admin/pages/orders/index", {
      pageTitle: "Danh sách đơn hàng",
      orders: orders,
      keyword: req.query.keyword || "",
      filterStatus: filterStatus,
      pagination: pagination
    })
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/dashboard`);
  }
};
// [PATCH] /admin/orders/change-status/:statusChange/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("orders_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Order.update({
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
      res.redirect(`/${systemConfig.prefixAdmin}/oders`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/orders/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("orders_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "confirm":
        case "initial":
          await Order.update({ status: status }, {
            where: {
              id: {
                [Op.in]: ids
              }
            }
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await Order.update({ deleted: true }, {
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
      res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/orders/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {

    const id = req.params.id;
    const order = await Order.findOne({
      where: {
        id: id,
        deleted: false
      },
      raw: true
    });
    order["totalPrice"] = 0;
    const item_order = await OrderItem.findAll({
      where: {
        orderId: id
      },
      raw: true
    });
    for (const item of item_order) {
      order["totalPrice"] += item["price"] * (1 - item["discount"] / 100) * item["quantity"];
      const tourInfo = await Tour.findOne({
        where: {
          id: item["tourId"],
          deleted: false
        },
        attributes: ['title', 'images', 'slug', 'price'],
        raw: true
      });
      if (tourInfo["images"]) {
        const images = JSON.parse(tourInfo["images"]);
        tourInfo["image"] = images[0];
      };
      item["tourInfo"] = tourInfo;
      item["totalPrice"] = item["price"] * (1 - item["discount"] / 100) * item["quantity"];
      item["priceNew"] = item["price"] * (1 - item["discount"] / 100);

    }
    if (order) {
      res.render("admin/pages/orders/edit", {
        pageTitle: "Chỉnh sửa đơn hàng",
        order: order,
        item_order: item_order
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/orders`);
    }
  }
  catch (error) {
    console.log(error);
    res.redirect(`/${systemConfig.prefixAdmin}/orders`);
  }
}
// [GET] /admin/orders/edit/:id
export const deleteItem = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const item = await OrderItem.findOne({
      where: {
        id: id
      }
    });
    const tourInfo = await Tour.findOne({
      where: {
        id: item["tourId"]
      }
    });
    const stockNew = tourInfo["stock"] + item["quantity"];
    await Tour.update(
      { stock: stockNew },
      { where: { id: item["tourId"] } }
    );
    await OrderItem.destroy({
      where: {
        id: id
      }
    });
    req.flash("success", "Cập nhật thành công");
    res.redirect("back");
  }
  catch (error) {
    console.log(error);
    res.redirect(`/${systemConfig.prefixAdmin}/orders`);
  }
}
// [PATCH] /admin/orders/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("orders_edit")) {
    try {
      const id = req.params.id;
      const data = {
        fullName: req.body.fullName,
        phone: req.body.phone,
        address: req.body.address,
        note: req.body.note,
        updatedBy: res.locals.account.id
      }
      await Order.update(data, {
        where: {
          id: id,
          deleted: false
        }
      });
      // Đảm bảo rằng tourId[] và quantities luôn là mảng  
      let tourIds;
      if (Array.isArray(req.body['tourId[]'])) {
        // Nếu 'tourId[]' là một mảng  
        tourIds = req.body['tourId[]'];
      } else {
        // Nếu không, gán giá trị thành một mảng với một phần tử  
        tourIds = [req.body['tourId[]']];
      }

      let quantities;
      if (Array.isArray(req.body.quantity)) {
        // Nếu 'quantity' là một mảng  
        quantities = req.body.quantity;
      } else {
        // Nếu không, gán giá trị thành một mảng với một phần tử  
        quantities = [req.body.quantity];
      }
      // Cập nhật thông tin trong OrderItem  
      for (let i = 0; i < tourIds.length; i++) {
        const tourId = parseInt(tourIds[i], 10); // Chuyển đổi sang số nguyên  
        const quantity = parseInt(quantities[i], 10); // Chuyển đổi sang số nguyên
        const item_order = await OrderItem.findOne({
          where: {
            orderId: id,
            tourId: tourId  // Thêm điều kiện tourId  
          },
          raw: true
        });
        if (quantity > item_order["quantity"]) {
          const quantityMinus = quantity - item_order["quantity"];
          const tour = await Tour.findOne({
            where: {
              id: tourId
            },
            raw: true
          });
          const newStock = tour["stock"] - quantityMinus;
          await Tour.update(
            { stock: newStock },
            { where: { id: tourId } }
          );
        } else {
          const quantityMinus = item_order["quantity"] - quantity;
          const tour = await Tour.findOne({
            where: {
              id: tourId
            },
            raw: true
          });
          const newStock = tour["stock"] + quantityMinus;
          await Tour.update(
            { stock: newStock },
            { where: { id: tourId } }
          );
        }
        // Cập nhật hoặc tạo mới bản ghi OrderItem
        const data = {
          tourId: tourId,
          quantity: quantity,
        }
        await OrderItem.update(data, {
          where: {
            orderId: id,
            tourId: tourId
          }
        });

      }
      req.flash("success", "Cập nhật sản phẩm thành công!");

    } catch (error) {
      req.flash("error", "Id sản phẩm không hợp lệ !");
    }
    res.redirect("back");
  } else {
    res.send(`403`);
  }
}