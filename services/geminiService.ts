import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Concept } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CONCEPT_SCHEMA: Schema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      conceptName: { type: Type.STRING },
      salesGoal: {
        type: Type.OBJECT,
        properties: {
          emotionalTrigger: { type: Type.STRING },
          usp: { type: Type.STRING },
          perceivedValue: { type: Type.STRING },
        },
        required: ["emotionalTrigger", "usp", "perceivedValue"],
      },
      context: {
        type: Type.OBJECT,
        properties: {
          location: { type: Type.STRING },
          lighting: { type: Type.STRING },
          colorPalette: { type: Type.STRING },
          vibe: { type: Type.STRING },
        },
        required: ["location", "lighting", "colorPalette", "vibe"],
      },
      poses: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING, description: "Description of the pose in Vietnamese" },
            aiPrompt: { type: Type.STRING, description: "Detailed AI generation prompt for this specific pose in English, formatted as a JSON string" },
          },
          required: ["description", "aiPrompt"],
        },
        description: "List of 5 detailed poses with specific AI prompts",
      },
      style: {
        type: Type.OBJECT,
        properties: {
          makeupAndHair: { type: Type.STRING },
          garmentNotes: { type: Type.STRING },
        },
        required: ["makeupAndHair", "garmentNotes"],
      },
      finalAiPrompt: { type: Type.STRING, description: "The general style and subject image generation prompt in English, formatted as a JSON string" },
    },
    required: ["conceptName", "salesGoal", "context", "poses", "style", "finalAiPrompt"],
  },
};

const fileToPart = async (file: File) => {
  return new Promise<{ inlineData: { data: string; mimeType: string } }>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve({
        inlineData: {
          data: base64String,
          mimeType: file.type,
        },
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const generateConcepts = async (
  fullShot: File,
  detailShot: File | null,
  modelShot: File | null,
  modelStyle: string,
  context: string,
  description: string
): Promise<Concept[]> => {
  
  const parts = [];

  // Add Full Shot (Mandatory)
  parts.push(await fileToPart(fullShot));
  parts.push({ text: "Đây là hình ảnh toàn cảnh sản phẩm (Full Product Shot)." });

  // Add Detail Shot (Optional)
  if (detailShot) {
    parts.push(await fileToPart(detailShot));
    parts.push({ text: "Đây là ảnh cận chất liệu (Material Detail Shot)." });
  }

  // Add Model Shot (Optional)
  if (modelShot) {
    parts.push(await fileToPart(modelShot));
    parts.push({ text: "Đây là ảnh người mẫu để đồng nhất nhân vật (Model Portrait)." });
  }

  const promptText = `
    Bạn là Giám đốc Sáng Tạo thời trang cấp cao (Senior Fashion Creative Director).
    Nhiệm vụ: Phân tích hình ảnh sản phẩm được cung cấp và tạo ra 3 Concept ảnh bán hàng khác nhau.
    
    Yêu cầu đầu vào:
    - Phong cách Model chủ đạo (Model Style): ${modelStyle}
    - Bối cảnh mong muốn: ${context}
    - Mô tả thêm của người dùng: ${description || "Không có mô tả thêm, hãy tự sáng tạo dựa trên ảnh."}

    QUY ĐỊNH VỀ PROMPT TIẾNG ANH (QUAN TRỌNG):
    Tất cả các trường 'aiPrompt' (cho từng pose) và 'finalAiPrompt' (tổng quan) PHẢI là một chuỗi JSON (JSON String) tuân thủ chính xác cấu trúc sau đây. 
    ĐẶC BIỆT: Phần "subject_model" trong JSON phải phản ánh đúng "Phong cách Model chủ đạo" đã chọn ở trên (Ví dụ: Nếu chọn Model Hàn Quốc thì ethnicity phải là 'Korean', skin là 'Fair, dewy', feature là 'Soft, delicate', v.v...).

    Cấu trúc JSON bắt buộc:
    {
      "scene": {
        "description": "...",
        "environment": "...",
        "mood": "...",
        "aesthetic": {
          "style": "Photorealistic, high-fashion editorial, clean, ultra-high resolution, 4K...",
          "look": "..."
        }
      },
      "lighting": {
        "description": "..."
      },
      "subject_model": {
        "description": "Describe the model based on the selected '${modelStyle}'...",
        "demographics": {
          "ethnicity": "Vietnamese / Korean / Chinese / Asian...",
          "age": "...",
          "build": "..."
        },
        "appearance": {
          "hair": "...",
          "skin": "...",
          "makeup": "..."
        },
        "pose": {
          "type": "...",
          "action": "...",
          "framing": "..."
        }
      },
      "subject_mannequin": {
        "style": "...",
        "pose": "..."
      },
      "wardrobe_and_accessories": {
        "shared_product": "..."
      },
      "camera_technical": {
        "requirements": [
          "The product worn by the model and the mannequin MUST be identical to the one in the provided product image.",
          "Maintain the original, true-to-life color palette.",
          "The scene environment and lighting must be 100% identical for all shots within the same concept."
        ],
        "capture": "Shot on professional DSLR...",
        "composition": "...",
        "retouching": "...",
        "avoid": ["Warped doors", "Heavy vignettes", "Oversharpening", "Unrealistic distortions"]
      }
    }

    Yêu cầu đầu ra cho từng Concept (Tổng cộng 3 concept khác nhau 100%):
    1. Tên Concept.
    2. Mục tiêu bán hàng: Đánh vào cảm xúc/lý tính, USP, Giá trị cảm nhận.
    3. Bối cảnh & Không gian: Địa điểm, Ánh sáng, Tông màu, Vibe (phù hợp khách hàng 25-45).
    4. 5 Pose gợi ý:
       - Mô tả chi tiết (Tiếng Việt): Toàn thân, Nửa người, Cận mặt, Động, Lifestyle.
       - Prompt riêng cho pose này (Tiếng Anh): Điền vào cấu trúc JSON ở trên, thay đổi phần 'pose', 'action', 'framing' và 'composition' cho phù hợp với pose cụ thể này.
    5. Style thống nhất: Màu da, makeup, giữ nguyên form dáng sản phẩm. Đảm bảo mô tả đúng phong cách model ${modelStyle}.
    6. Prompt tạo ảnh tổng quan (Final AI Prompt): Điền vào cấu trúc JSON ở trên mô tả tổng quan concept.

    Ngôn ngữ: Các mục mô tả (1-5) là TIẾNG VIỆT. Các Prompt JSON là TIẾNG ANH.
    Đảm bảo văn phong sắc nét, chuyên nghiệp, định hướng bán hàng (High-end Fashion Sales).
  `;

  parts.push({ text: promptText });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{ parts }],
      config: {
        responseMimeType: "application/json",
        responseSchema: CONCEPT_SCHEMA,
        temperature: 0.8, // Slightly creative
      },
    });

    if (response.text) {
      return JSON.parse(response.text) as Concept[];
    }
    throw new Error("No response text generated");
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
            aspectRatio: "3:4", 
        }
      }
    });

    for (const candidate of response.candidates || []) {
        for (const part of candidate.content?.parts || []) {
            if (part.inlineData) {
                return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            }
        }
    }
    throw new Error("Không tìm thấy ảnh trong phản hồi.");
  } catch (error) {
    console.error("Image Generation Error:", error);
    throw error;
  }
};
