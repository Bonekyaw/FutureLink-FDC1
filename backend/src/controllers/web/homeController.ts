import { Request, Response } from "express";

export const home = (req: Request, res: Response) => {
  res.render("index", { title: "Future Link Developers" });
};
