import CarModel from "../models/car_model.js";
import { getUserId } from "../middlewares/auth.js";
import { AiService } from "../utilities/ai_api_service.js";

const diagnoseCar = async (req, res) => {
  try {
    const user_id = getUserId(req);
    const car = await CarModel.getCarByUserId(user_id);
    if (!car) return res.status(404).send({ message: "car not found" });

    const symptom = req.body.prompt;

    // ---------------- Validation ----------------
    if (!car || typeof car !== "object") {
      return res.status(400).json({
        success: false,
        message: "car not found",
      });
    }

    if (!symptom || typeof symptom !== "string") {
      return res.status(400).json({
        success: false,
        message: "symptom is required",
      });
    }

    // ---------------- AI Service ----------------
    const aiService = new AiService({
      useMock: false, // true برای تست
    });

    const result = await aiService.diagnose({
      car,
      symptom,
    });

    // ---------------- Response ----------------
    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Diagnose Error:", error.message);

    return res.status(500).json({
      success: false,
      message: error.message || "خطای داخلی سرور",
    });
  }
};

export { diagnoseCar };
