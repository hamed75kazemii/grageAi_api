import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
/**
 * AI Service for car diagnostics (Node.js)
 */
export class AiService {
  constructor({
    useMock = false,
    apiKey = process.env.PERPLEXITY_API_KEY,
  } = {}) {
    this.useMock = useMock;
    this.apiKey = apiKey;

    console.log("PERPLEXITY KEY:", this.apiKey);
    this.http = axios.create({
      //  baseURL: "https://api.openai.com/v1",
      baseURL: "https://api.perplexity.ai",
      timeout: 120_000,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.PERPLEXITY_API_KEY}`,
      },
    });
  }

  /**
   * Main diagnose method
   */
  async diagnose({ car, symptom }) {
    if (this.useMock) {
      return this.#mockDiagnose({ car, symptom });
    }
    return this.#realDiagnose({ car, symptom });
  }

  /* -------------------------------------------------------------------------- */
  /*                                   MOCK                                     */
  /* -------------------------------------------------------------------------- */

  async #mockDiagnose({ car, symptom }) {
    await new Promise((r) => setTimeout(r, 700 + Math.random() * 500));

    const diagnoses = [];
    const s = symptom.toLowerCase();

    if (s.includes("تق") || s.includes("صدا")) {
      diagnoses.push({
        issue: "تسمه تایمینگ فرسوده یا شل",
        explanation:
          "صدای تق‌تق معمولاً نشان‌دهنده تسمه تایمینگ فرسوده یا شل است.",
        detailedExplanation:
          "تسمه تایمینگ هماهنگی بین میل‌لنگ و میل‌بادامک را برقرار می‌کند. فرسودگی یا شل بودن آن می‌تواند باعث صدای غیرعادی، افت قدرت موتور و حتی آسیب جدی به موتور شود.",
        estimatedCostMin: 1500000,
        estimatedCostMax: 4000000,
        videoLinks: [],
        confidence: 0.82,
      });
    } else if (s.includes("دود") || s.includes("smoke")) {
      diagnoses.push({
        issue: "سوختن روغن موتور",
        explanation: "دود آبی نشانه ورود روغن به محفظه احتراق است.",
        detailedExplanation:
          "این مشکل معمولاً به دلیل فرسودگی رینگ پیستون یا خرابی واشر سرسیلندر رخ می‌دهد و نیاز به بررسی تخصصی دارد.",
        estimatedCostMin: 3000000,
        estimatedCostMax: 12000000,
        videoLinks: [],
        confidence: 0.75,
      });
    } else {
      diagnoses.push({
        issue: "نیاز به بررسی جامع",
        explanation: "علائم مشخص نیست و نیاز به بررسی تخصصی دارد.",
        detailedExplanation:
          "برای تشخیص دقیق، خودرو باید با دستگاه دیاگ و بررسی فیزیکی توسط تعمیرکار متخصص بررسی شود.",
        estimatedCostMin: 500000,
        estimatedCostMax: 2000000,
        videoLinks: [],
        confidence: 0.45,
      });
    }

    return {
      diagnoses,
      timestamp: new Date(),
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                   REAL                                     */
  /* -------------------------------------------------------------------------- */

  async #realDiagnose({ car, symptom }) {
    if (!this.apiKey) {
      throw new Error("API Key not found");
    }

    const prompt = this.#buildPrompt({ car, symptom });

    try {
      const response = await this.http.post("/chat/completions", {
        //    model: "gpt-4o-mini",
        model: "sonar",
        temperature: 0.7,
        max_tokens: 2000,
        messages: [
          {
            role: "system",
            content:
              "شما یک متخصص تشخیص مشکلات خودرو هستید. پاسخ را فقط به صورت JSON ارائه دهید.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
      });

      const content = response.data.choices[0].message.content;

      return this.#parsePerplexityResponse(content);
    } catch (err) {
      if (err.response?.status === 401) {
        console.log(err.response.data);
        throw new Error("Invalid API Key");
      }
      if (err.response?.status === 429) {
        console.log(err.response.data);
        throw new Error("Request limit reached");
      }
      if (err.response?.status >= 500) throw new Error("Srver error");
      console.log(err.response);
      throw new Error(`Error: ${err.message}`);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                                  PROMPT                                    */
  /* -------------------------------------------------------------------------- */

  #buildPrompt({ car, symptom }) {
    return `
اطلاعات خودرو:
- برند: ${car.brand_name}
- مدل: ${car.model_name}
- سال ساخت: ${car.produce_date}
- کیلومتر: ${car.distance}
- ظرفیت سیلندر: ${car.cylinder_capacity}
- مدل موتور: ${car.engine_model}
- گیربکس: ${car.gearbox_model}
- آخرین سرویس: ${car.service_date}

علائم:
${symptom}

خروجی فقط JSON با فرمت:
 در detailed_explanation توضحیات بیشتری بده 
 و گذاشتن شماره در انتهای توضحیات رو انجام نده
{
  "diagnoses": [
    {
      "issue": "",
      "explanation": "",
      "detailed_explanation": "",
      "estimated_cost_min": 0,
      "estimated_cost_max": 0,
      "video_links": [],
      "confidence": 0.0
    }
  ]
}
`;
  }

  /* -------------------------------------------------------------------------- */
  /*                                   PARSE                                    */
  /* -------------------------------------------------------------------------- */

  #parsePerplexityResponse(content) {
    try {
      let jsonText = content.trim();

      if (jsonText.startsWith("```")) {
        jsonText = jsonText
          .split("\n")
          .filter((l) => !l.startsWith("```"))
          .join("\n");
      }

      const start = jsonText.indexOf("{");
      const end = jsonText.lastIndexOf("}");
      jsonText = jsonText.slice(start, end + 1);

      const parsed = JSON.parse(jsonText);

      return {
        diagnoses: parsed.diagnoses.map((d) => ({
          issue: d.issue ?? "نامشخص",
          explanation: d.explanation ?? "",
          detailedExplanation: d.detailed_explanation ?? d.explanation ?? "",
          estimatedCostMin: Number(d.estimated_cost_min ?? 0),
          estimatedCostMax: Number(d.estimated_cost_max ?? 0),
          videoLinks: d.video_links ?? [],
          confidence: Number(d.confidence ?? 0.5),
        })),
        timestamp: new Date(),
      };
    } catch (e) {
      return {
        diagnoses: [
          {
            issue: "Error in processing response",
            explanation: "Response is not processable",
            detailedExplanation: "Invalid JSON or missing response",
            estimatedCostMin: 0,
            estimatedCostMax: 0,
            videoLinks: [],
            confidence: 0,
          },
        ],
        timestamp: new Date(),
      };
    }
  }
}
