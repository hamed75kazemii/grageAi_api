import TipsModel from "../models/tips_model.js";

const tipsController = async (req, res, next) => {
  const tips = await TipsModel.getTips();
  res.status(200).send(tips);
};

export { tipsController };
