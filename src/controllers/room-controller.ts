import { Request, Response } from "express";
import { prismaClient } from "../lib/prisma";
import bcrypt from "bcrypt";

export const createRoom = async (req: Request, res: Response) => {
  const { password } = req.body;

  const hasedPassword = await bcrypt.hash(password, 10);

  console.log(hasedPassword);

  res.status(200).send({
    status: "success",
    message: "Api funcionando",
    data: hasedPassword,
  });
};
