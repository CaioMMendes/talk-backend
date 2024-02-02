import express, { Application, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
const cors = require("cors");
import { corsOptions } from "./config/cors-options";
import { testeRouter } from "./routes/teste-route";
import http from "http";
import { Server, Socket } from "socket.io";
import { roomRouter } from "./routes/room-route";

// dotenv.config();

class App {
  private app: Application;
  private http: http.Server;
  private io: Server;
  private testeRouter = testeRouter;
  private roomRouter = roomRouter;

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
    this.initializeCors();
    this.middlewaresInitialize();
    this.initializeRoutes();
  }

  private middlewaresInitialize() {
    this.app.use(express.json());
    // this.app.use(express.urlencoded({ extended: true })); // converte ' ' em %20
  }
  private initializeRoutes() {
    this.app.use("/api/v1", this.testeRouter);
    this.app.use("/api/v1", this.roomRouter);
  }
  private initializeCors() {
    this.app.use(cors(corsOptions));
  }

  public listenSocket() {
    this.io.of("/streams").on("connection", this.socketEvents);
  }

  private socketEvents(socket: Socket) {
    console.log("socket connected: " + socket.id);
    socket.on("subscribe", (data) => {
      console.log("usuario inserido na sala:" + data.roomId);
      socket.join(data.roomId);
      socket.join(data.socketId);

      const roomSession = Array.from(socket.rooms);

      if (roomSession.length > 1) {
        socket.to(data.roomId).emit("new user", {
          socketId: socket.id,
          username: data.username,
        });
      }
    });

    socket.on("chat", (data) => {
      socket.broadcast.to(data.roomId).emit("chat", {
        message: data.message,
        username: data.username,
        time: data.time,
      });
    });

    socket.on("newUserStart", (data) => {
      console.log("Novo usuario chegou");
      socket.to(data.to).emit("newUserStart", {
        sender: data.sender,
      });
    });
  }

  public listen() {
    this.http.listen(process.env.PORT, () => {
      console.log(`Running on port ${process.env.PORT}`);
    });
  }
}

// const app = new App();

// app.use(cors(corsOptions));
// app.use(express.json());

// //Routes
// app.use("/api/v1", testeRouter);

export { App };
