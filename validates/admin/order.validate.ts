import { Request, Response, NextFunction } from "express";
export const inFoUserOrder = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.body.fullName || !req.body.phone || !req.body.address) {
    // req.flash("error", "Vui lòng  điền đầy đủ thông tin!");
    res.redirect("back");
    return;
  }
  next();
}
