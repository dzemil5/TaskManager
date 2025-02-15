import express from "express";
import userRoutes from "./routes/userRoutes";
import taskRoutes from "./routes/taskRoutes";
import { authMiddleware } from "./middlewares/authMiddleware";
import { getUserProfile } from "./controllers/userController";

const app = express();

app.use(express.json());

/**Routes */
app.use("/api", taskRoutes);
app.use("/api/users", userRoutes);
app.use("/api/users/profile", authMiddleware, getUserProfile);

export default app;
