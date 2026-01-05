import pool from "../utilities/mysql_database.js";

class CarModel {
  static getCarByUserId = async (user_id) => {
    const [result] = await pool.query("select * from cars where user_id = ?", [
      user_id,
    ]);
    return result[0];
  };

  static insertCar = async (
    brand_name,
    service_date,
    produce_date,
    cylinder_capacity,
    engine_model,

    model_name,
    distance,
    gearbox_model,
    user_id
  ) => {
    const [result] = await pool.query(
      `insert into cars 
    (id, brand_name, service_date, produce_date, cylinder_capacity, engine_model,  model_name, distance, gearbox_model,user_id) 
    values ( uuid() ,?,?,?,?,?,?,?,?,?)`,
      [
        brand_name,
        service_date,
        produce_date,
        cylinder_capacity,
        engine_model,
        model_name,
        distance,
        gearbox_model,
        user_id,
      ]
    );
    return result;
  };

  static updateCar = async (
    brand_name,
    service_date,
    produce_date,
    cylinder_capacity,
    engine_model,

    model_name,
    distance,
    gearbox_model,
    user_id
  ) => {
    const [result] = await pool.query(
      `update cars 
    set brand_name = ?, service_date = ?, produce_date = ?, 
    cylinder_capacity = ?, engine_model = ?, model_name = ?, distance = ?, gearbox_model = ?
    where user_id = ?`,
      [
        brand_name,
        service_date,
        produce_date,
        cylinder_capacity,
        engine_model,

        model_name,
        distance,
        gearbox_model,
        user_id,
      ]
    );
    return result;
  };

  static upsertCar = async (
    brand_name,
    service_date,
    produce_date,
    cylinder_capacity,
    engine_model,
    model_name,
    distance,
    gearbox_model,

    user_id
  ) => {
    const existingCar = await this.getCarByUserId(user_id);

    if (existingCar) {
      // Update existing car
      const result = await this.updateCar(
        brand_name,
        service_date,
        produce_date,
        cylinder_capacity,
        engine_model,

        model_name,
        distance,
        gearbox_model,
        user_id
      );
      return { ...result, isUpdate: true };
    } else {
      // Insert new car
      const result = await this.insertCar(
        brand_name,
        service_date,
        produce_date,
        cylinder_capacity,
        engine_model,

        model_name,
        distance,
        gearbox_model,
        user_id
      );
      return { ...result, isUpdate: false };
    }
  };

  static removeCar = async (user_id) => {
    const [result] = await pool.query("delete from cars where user_id = ?", [
      user_id,
    ]);

    return result;
  };
  static getCarByUserId = async (user_id) => {
    const [result] = await pool.query("select * from cars where user_id = ?", [
      user_id,
    ]);
    return result[0];
  };
}
export default CarModel;
