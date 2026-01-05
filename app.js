import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoute from "./src/routes/auth_route.js";
import carRoute from "./src/routes/car_route.js";
import tipsRoute from "./src/routes/tips_route.js";
import homeRoute from "./src/routes/home_route.js";
import diagnosisRoute from "./src/routes/diagnose_route.js";

dotenv.config();
const app = express();

app.use(morgan("tiny"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello Welcome to Garage Ai API");
});

app.use("/auth", authRoute);
app.use("/car", carRoute);
app.use("/tips", tipsRoute);
app.use("/home", homeRoute);
app.use("/diagnose", diagnosisRoute);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
