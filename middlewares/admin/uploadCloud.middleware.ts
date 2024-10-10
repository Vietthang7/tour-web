import { NextFunction, Request, Response } from "express";

import { streamUpload } from "../../helpers/streamUpload.helper";

export const uploadSingle = (req: Request, res: Response, next: NextFunction) => {
  if(req["file"]) {
    const uploadToCloudinary = async (buffer) => {
      const result = await streamUpload(buffer);
      req.body[req["file"].fieldname] = result["url"];
      next();
    }

    uploadToCloudinary(req["file"].buffer);
  } else {
    next();
  }
}

export const uploadFields = async (req: Request, res: Response, next: NextFunction) => {
  try {
    for (const key in req["files"]) {
      req.body[key] = [];
  
      const array = req["files"][key];
      for (const item of array) {
        const result = await streamUpload(item.buffer);
        req.body[key].push(result["url"]);
      }
    }
  
    next();
  } catch (error) {
    console.log(error);
  }
}