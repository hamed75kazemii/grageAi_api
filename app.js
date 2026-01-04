import express from "express";
import dotenv from "dotenv";
import authRoute from "./src/routes/auth_route.js";
import carRoute from "./src/routes/car_route.js";
dotenv.config();
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Welcome to Garage Ai API");
});

app.use("/auth", authRoute);
app.use("/car", carRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
