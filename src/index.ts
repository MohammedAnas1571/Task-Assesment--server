import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDatabase } from "./db_connection/mongoDB";
import adminRouter from "./router/route";
import AppError from "./utils/appError";
import cookieParser from "cookie-parser"

dotenv.config();

const app: Express = express();

app.use(cors({
  origin: process.env.ORIGIN,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use("/public", express.static("public"));

connectToDatabase();

app.use("/admin", adminRouter);

app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ message: err.message });
});

const port = process.env.PORT || 3000;


app.listen(port, () => {
  console.log(` Server is running at http://localhost:${port}`);
});
