import { Request, Response, NextFunction } from "express";
export const createRole = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.title) {
    req.flash("error", "Tên quyền không được để trống!");
    res.redirect("back");
    return;
  }
  next();
}