import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");
import { corsOptions } from "./config/cors-options";
import { testeRouter } from "./routes/teste-route";
import http from "http";
import { Server, Socket } from "socket.io";

// dotenv.config();

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  private testeRouter = testeRouter;

  constructor() {
    this.app = express();
    this.http = new http.Server(this.app);
    this.io = new Server(this.http, {
      cors: {
        origin: [
          process.env.FRONTEND_URL_1!,
          process.env.FRONTEND_URL_2!,
          process.env.FRONTEND_URL_3!,
          process.env.FRONTEND_URL_4!,
        ],
      },
    });
    dotenv.config();

    this.middlewaresInitialize();
    this.initializeRoutes();
  }

  private middlewaresInitialize() {
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true })); // converte ' ' em %20
  }
  private initializeRoutes() {
    this.app.use("/api/v1", this.testeRouter);
  }

  public listenSocket() {
    this.io.of("/streams").on("connection", this.socketEvents);
  }

  private socketEvents(socket: Socket) {
    console.log("socket connected: " + socket.id);
    socket.on("subscribe", (data) => {
      console.log("usuario inserido na sala:" + data.roomId);
      socket.join(data.roomId);

      socket.on("chat", (data) => {
        socket.broadcast.to(data.roomId).emit("chat", {
          message: data.message,
          username: data.username,
          time: data.time,
        });
      });
    });
  }

  public listen() {
    this.http.listen(process.env.PORT, () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  }
}

const app = new App();

// app.use(cors(corsOptions));
// app.use(express.json());

// //Routes
// app.use("/api/v1", testeRouter);

export { App };
