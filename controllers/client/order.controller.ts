import { Request, Response } from "express";
import Order from "../../models/order.model";
import { generateOrderCode } from "../../helpers/generate.helper";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";
import moment from "moment";
// [POST] /order
export const index = async (req: Request, res: Response) => {
  const data = req.body;
  // Lưu data vào bảng orders
  const dataOrders = {
    code: "",
    fullName: data.info.fullName,
    phone: data.info.phone,
    note: data.info.note,
    address: data.info.address,
    status: "initial",
  };
  const order = await Order.create(dataOrders);
  const orderId = order.dataValues.id;
  const code = generateOrderCode(orderId);

  await Order.update({
    code: code
  }, {
    where: {
      id: orderId
    }
  });

  //Hết lưu data vào bảng orders

  for (const item of data.cart) {
    const dataItem = {
      orderId: orderId,
      tourId: item.tourId,
      quantity: item.quantity,
    };
    const tourInfo = await Tour.findOne({
      where: {
        id: item.tourId,
        deleted: false,
        status: "active"
      },
      raw: true,
    });
    dataItem["price"] = tourInfo["price"];
    dataItem["discount"] = tourInfo["discount"];
    dataItem["timeStart"] = tourInfo["timeStart"];
    await OrderItem.create(dataItem);
    // // Cập nhật stock của tour  
    const newStock = tourInfo["stock"] - item.quantity;
    // Kiểm tra xem stock có đủ không  
    if (newStock < 0) {
      res.json({ code: 400, message: "Số lượng tồn kho không đủ." });
      return;
    }
    await Tour.update(
      { stock: newStock },
      { where: { id: item.tourId } }
    );
  }
  // Hết Lưu data vào bảng orders_item
  res.json({
    code: 200,
    message: "Đặt hàng thành công!",
    orderCode: code
  });
};
// [POST] /order/success/:orderCode
export const success = async (req: Request, res: Response) => {
  const orderCode = req.params.orderCode;
  const order = await Order.findOne({
    where: {
      code: orderCode,
      deleted: false,
    },
    raw: true,
  });
  if (order["createdAt"]) {
    order["createdAt"] = moment(order["createdAt"]).format("DD/MM/YY HH:mm:ss");
  }
  // console.log(order);
  const ordersItem = await OrderItem.findAll({
    where: {
      orderId: order["id"],
    },
    raw: true
  });
  // console.log(ordersItem);
  let total = 0;
  for (const item of ordersItem) {
    item["price_special"] = (item["price"] * (1 - item["discount"] / 100));
    item["total"] = item["price_special"] * item["quantity"];
    total += item["total"];
    const tourInfo = await Tour.findOne({
      where: {
        id: item["tourId"],
      },
      raw: true,
    });
    tourInfo["images"] = JSON.parse(tourInfo["images"]);
    item["image"] = tourInfo["images"][0];
    item["title"] = tourInfo["title"];
    item["slug"] = tourInfo["slug"];

  }
  res.render("client/pages/order/success", {
    pageTitle: "Đặt hàng thành công",
    order: order,
    ordersItem: ordersItem,
    total: total
  });
}
