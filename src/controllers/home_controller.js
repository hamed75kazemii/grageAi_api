import ProblemModel from "../models/problem_model.js";

const homeController = async (req, res, next) => {
  const problems = await ProblemModel.getProblems();
  res.status(200).send({ problems: problems });
};

export { homeController };
