import CarModel from "../models/car_model.js";
import Joi from "joi";
import { getUserId } from "../middlewares/auth.js";

const insertCar = async (req, res, next) => {
  const user_id = getUserId(req);
  const schema = {
    brand_name: Joi.string().max(50).required(),
    service_date: Joi.date().required(),
    produce_date: Joi.date().required(),
    cylinder_capacity: Joi.string().max(50).required(),
    engine_model: Joi.string().max(50).required(),
    //  user_id: Joi.string().max(50).required(),
    model_name: Joi.string().max(50).required(),
    distance: Joi.string().max(50).required(),
    gearbox_model: Joi.string().max(50).required(),
  };

  const validateResult = Joi.object(schema).validate(req.body);
  if (validateResult.error) throw validateResult.error;

  const result = await CarModel.upsertCar(
    req.body.brand_name,
    req.body.service_date,
    req.body.produce_date,
    req.body.cylinder_capacity,
    req.body.engine_model,

    req.body.model_name,
    req.body.distance,
    req.body.gearbox_model,
    user_id
  );

  if (result.affectedRows === 0)
    return res.status(400).send({ message: "car operation failed 1" });

  const message = result.isUpdate
    ? "car updated successfully"
    : "car inserted successfully";
  res.status(200).send({ message: message });
};

const removeCar = async (req, res, next) => {
  const user_id = getUserId(req);

  const result = await CarModel.removeCar(user_id);
  if (result.affectedRows === 0)
    return res.status(400).send({ message: "car operation failed" });
  res.status(200).send({ message: "car removed successfully" });
};

export { insertCar, removeCar };
