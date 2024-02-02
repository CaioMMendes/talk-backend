import express from "express";
import { createRoom } from "../controllers/room-controller";
const roomRouter = express.Router();

roomRouter.route("/room/:id").post(createRoom);

export { roomRouter };
