import express, { Application } from "express";
import dotenv from "dotenv";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import { errorMiddleware } from "./middlewares/errorMiddleware";

dotenv.config();

const app: Application = express();

app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api", taskRoutes);

app.get("/", (req, res) => {
  res.send("Server is running");
});

app.get("/api/test", (req, res) => {
  res.send("Test route works!");
});

app.use(errorMiddleware);

const port: string = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
