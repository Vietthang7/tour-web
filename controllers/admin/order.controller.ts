import Order from "../../models/order.model";
import Tour from "../../models/tour.model";
import OrderItem from "../../models/order-item.model";
import { Request, Response } from "express";
Order.hasMany(OrderItem, { foreignKey: 'orderId' }); // Một Order có nhiều OrderItem  
OrderItem.belongsTo(Order, { foreignKey: 'orderId' }); // Một OrderItem thuộc về một Order  

OrderItem.belongsTo(Tour, { foreignKey: 'tourId' }); // Một OrderItem thuộc về một Tour  
Tour.hasMany(OrderItem, { foreignKey: 'tourId' }); // Một Tour có nhiều OrderItem  
//[GET]/admin/tours
export const index = async (req: Request, res: Response) => {
  const orders = await Order.findAll({
    include: [{
      model: OrderItem,
      include: [{
        model: Tour,
        attributes: ['id', 'title', 'price', 'code'], // Chọn các thuộc tính cần thiết từ model Tour  
      }],
    }],
    where: {
      deleted: false, // Lọc để lấy các đơn hàng chưa bị xóa  
    },
    attributes: ['id', 'code', 'fullName', 'phone', 'note', 'status'],
 // Chọn các thuộc tính cần thiết từ model Order  
  });
  
  console.log(orders);
  res.render("admin/pages/orders/index", {
    pageTitle: "Danh sách đơn hàng",
  })
};