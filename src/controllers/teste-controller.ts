import { Request, Response } from "express";
import { prismaClient } from "../lib/prisma";

export const teste = async (req: Request, res: Response) => {
  res.status(200).send({
    status: "success",
    message: "Api funcionando",
  });
};
