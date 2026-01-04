import CarModel from "../models/car_model.js";
import Joi from "joi";

const insertCar = async (req, res, next) => {
  const schema = {
    brand_name: Joi.string().max(50).required(),
    service_date: Joi.date().required(),
    produce_date: Joi.date().required(),
    cylinder_capacity: Joi.string().max(50).required(),
    engine_model: Joi.string().max(50).required(),
    user_id: Joi.string().max(50).required(),
  };
  console.log(req.body.user_id);
  const validateResult = Joi.object(schema).validate(req.body);
  if (validateResult.error) throw validateResult.error;

  const result = await CarModel.upsertCar(
    req.body.brand_name,
    req.body.service_date,
    req.body.produce_date,
    req.body.cylinder_capacity,
    req.body.engine_model,
    req.body.user_id
  );

  if (result.affectedRows === 0)
    return res.status(400).send({ message: "car operation failed" });

  const message = result.isUpdate
    ? "car updated successfully"
    : "car inserted successfully";
  res.status(200).send({ message: message });
};

export { insertCar };
