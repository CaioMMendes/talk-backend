import express from "express";
const testeRouter = express.Router();
import { teste } from "../controllers/teste-controller";

testeRouter.route("/teste").get(teste);

export { testeRouter };
