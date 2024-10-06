import { Request, Response } from "express";
// [POST] /order
export const index = async (req: Request, res: Response) => {
  console.log(req.body);
  res.json({
    code: 200,
    message: "Đặt hàng thành công!"
  });
};